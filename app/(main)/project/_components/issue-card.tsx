"use client";

import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Issue, IssuePriority, IssueStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteIssue, updateIssue } from "@/actions/issues";
import { toast } from "sonner";
import { IssueDetail } from "./issue-detail";

interface IssueCardProps {
  issue: Issue & {
    assignee?: {
      name: string | null;
      image: string | null;
    } | null;
  };
  onUpdate?: () => void;
}

const priorityColors: Record<IssuePriority, string> = {
  HIGH: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300",
  MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300",
  LOW: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300",
  URGENT: "bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/50 dark:text-rose-300",
};

const priorityLabels: Record<IssuePriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  URGENT: "Urgent",
};

const statusOptions: { value: IssueStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "DONE", label: "Done" },
];

export function IssueCard({ issue, onUpdate }: IssueCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    
    setIsLoading(true);
    try {
      const result = await deleteIssue(issue.id);
      if (result.success) {
        toast.success("Issue deleted successfully");
        onUpdate?.();
      }
    } catch (error) {
      console.error("Failed to delete issue:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete issue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: IssueStatus) => {
    if (newStatus === issue.status) return;
    
    setIsLoading(true);
    try {
      await updateIssue(issue.id, { 
        status: newStatus,
        priority: issue.priority 
      });
      onUpdate?.();
    } catch (error) {
      console.error("Failed to update issue status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update issue");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriorityChange = async (newPriority: IssuePriority) => {
    if (newPriority === issue.priority) return;
    
    setIsLoading(true);
    try {
      await updateIssue(issue.id, { 
        status: issue.status,
        priority: newPriority 
      });
      onUpdate?.();
    } catch (error) {
      console.error("Failed to update issue priority:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update issue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open detail if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, a, [role="button"]')) {
      return;
    }
    setIsDetailOpen(true);
  };

  const handleUpdate = () => {
    setIsDetailOpen(false);
    onUpdate?.();
  };

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow overflow-hidden group relative cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm line-clamp-2 pr-6">{issue.title}</h3>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }} disabled={isLoading}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <Badge 
              className={`text-xs cursor-pointer ${priorityColors[issue.priority] || priorityColors.MEDIUM}`}
              onClick={() => {
                const priorities = Object.keys(priorityColors) as IssuePriority[];
                const currentIndex = priorities.indexOf(issue.priority);
                const nextIndex = (currentIndex + 1) % priorities.length;
                handlePriorityChange(priorities[nextIndex]);
              }}
            >
              {priorityLabels[issue.priority] || issue.priority}
            </Badge>
            
            <div className="flex space-x-1">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(status.value);
                  }}
                  className={`text-xs px-2 py-0.5 rounded ${
                    issue.status === status.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  disabled={isLoading}
                >
                  {status.label[0]}
                </button>
              ))}
            </div>
          </div>
          
          {issue.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {issue.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-3 pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={issue.assignee?.image || undefined} alt={issue.assignee?.name || "Unassigned"} />
                <AvatarFallback className="text-xs">
                  {issue.assignee?.name ? getInitials(issue.assignee.name) : "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <IssueDetail 
        issue={issue} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)}
        onUpdate={handleUpdate}
      />
    </>
  );
}
