"use client";
import React, { useState, useEffect } from "react";
import SprintManager from "./sprint-manager";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import status from "@/data/status.json";
import { Button } from "@/components/ui/button";
import CreateIssueDrawer from "./create-issue";
import { Issue, IssueStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { IssueCard } from "./issue-card";
import {toast} from "sonner";

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
  description?: string;
}

interface SprintBoardProps {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
}

const SprintBoard: React.FC<SprintBoardProps> = ({
  sprints,
  projectId,
  orgId,
}) => {
  const [currentSprint, setCurrentSprint] = useState<Sprint>(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );
  const [issues, setIssues] = useState<(Issue & Record<string, unknown>)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fetchIssues = async () => {
    if (!currentSprint?.id) return;
    
    setIsLoading(true);
    try {
      const data = await getIssuesForSprint(currentSprint.id);
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      toast.error("Failed to load issues");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [currentSprint?.id]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId &&
         destination.index === source.index)) {
      return;
    }

    const newIssues = Array.from(issues);
    const [movedIssue] = newIssues.splice(source.index, 1);
    
    // Update status if moving to a different column
    if (destination.droppableId !== source.droppableId) {
      movedIssue.status = destination.droppableId as IssueStatus;
    }
    
    newIssues.splice(destination.index, 0, movedIssue);
    
    // Update order for all issues
    const updatedIssues = newIssues.map((issue, index) => ({
      ...issue,
      order: index,
    }));

    // Optimistic update
    setIssues(updatedIssues);

    try {
      // Update order in database
      await updateIssueOrder(
        updatedIssues.map((issue) => ({
          id: issue.id,
          status: issue.status,
          order: issue.order,
        }))
      );
    } catch (error) {
      console.error("Failed to update issue order:", error);
      // Revert on error
      setIssues(issues);
    }
  };

  const handleAddIssue = (statusKey: string) => {
    setSelectedStatus(statusKey);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = (newIssue: Issue) => {
    setIssues(prev => [...prev, newIssue]);
    setIsDrawerOpen(false);
    toast.success("Issue created successfully");
  };

  const handleIssueUpdated = () => {
    fetchIssues();
  };

  const getIssuesByStatus = (statusKey: string) => {
    return issues
      .filter((issue) => issue.status === statusKey)
      .sort((a, b) => a.order - b.order);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Sprint Board</h2>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {status.map((statusItem) => {
              const statusIssues = getIssuesByStatus(statusItem.key);
              
              return (
                <div key={statusItem.key} className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      {statusItem.name}
                    </h3>
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-muted">
                      {statusIssues.length}
                    </span>
                  </div>

                  <Droppable droppableId={statusItem.key}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 min-h-[500px] max-h-[calc(100vh-250px)] bg-muted/10 rounded-md p-2 space-y-3 overflow-y-auto"
                      >
                        {statusIssues.map((issue, index) => (
                          <Draggable
                            key={issue.id}
                            draggableId={issue.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                <IssueCard 
                                  issue={issue} 
                                  onUpdate={handleIssueUpdated}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  
                  {statusItem.key === "TODO" && currentSprint.status !== "COMPLETED" && (
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => handleAddIssue(statusItem.key)}
                      size="sm"
                    >
                      <span className="text-sm">+</span>
                      &nbsp;
                      Create issue
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </DragDropContext>

        <CreateIssueDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sprintId={currentSprint.id}
          status={selectedStatus || "TODO"}
          projectId={projectId}
          orgId={orgId}
          onIssueCreated={handleIssueCreated}
        />
      </div>
    </div>
  );
};

export default SprintBoard;
