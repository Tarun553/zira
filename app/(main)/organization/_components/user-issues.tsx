"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IssueCard } from "@/app/(main)/project/_components/issue-card";
import CreateIssueDrawer from "@/app/(main)/project/_components/create-issue";
import { Issue } from "@prisma/client";
import { useState } from "react";

interface UserIssuesProps {
  assignedIssues: Issue[];
  reportedIssues: Issue[];
  onIssueUpdate?: () => void;
}

export function UserIssues({
  assignedIssues = [],
  reportedIssues = [],
  onIssueUpdate = () => {},
}: UserIssuesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-3xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(to right, #9333ea, #ec4899, #eab308)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Geist', 'Inter', sans-serif",
            letterSpacing: "-0.03em"
          }}
        >
          My Issues
        </h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Issue
        </Button>
      </div>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
          <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
          <TabsTrigger value="reported">Reported by Me</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          {assignedIssues.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignedIssues.map((issue) => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onUpdate={onIssueUpdate} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No issues assigned to you.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reported" className="space-y-4">
          {reportedIssues.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reportedIssues.map((issue) => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onUpdate={onIssueUpdate} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You haven&apos;t reported any issues yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CreateIssueDrawer 
        isOpen={isCreateDialogOpen} 
        onClose={() => {
          setIsCreateDialogOpen(false);
          onIssueUpdate();
        }}
        sprintId=""
        status="TODO"
        projectId=""
        orgId=""
        onIssueCreated={onIssueUpdate}
      />
    </div>
  );
}
