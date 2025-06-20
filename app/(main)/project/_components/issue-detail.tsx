"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Issue, IssuePriority, IssueStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { updateIssue } from "@/actions/issues";
import { toast } from "sonner";
import { useState } from "react";

interface IssueDetailProps {
  issue: Issue & {
    assignee?: {
      name: string | null;
      image: string | null;
    } | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const priorityOptions: { value: IssuePriority; label: string }[] = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const statusOptions: { value: IssueStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "DONE", label: "Done" },
];

type FormData = {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
};

export function IssueDetail({ issue, isOpen, onClose, onUpdate }: IssueDetailProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: issue.title,
      description: issue.description || "",
      status: issue.status,
      priority: issue.priority,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!issue) return;
    
    setIsLoading(true);
    try {
      await updateIssue(issue.id, {
        status: data.status,
        priority: data.priority,
      });
      
      // Update title and description if changed
      if (data.title !== issue.title || data.description !== (issue.description || "")) {
        // Here you would call an update endpoint for title/description
        // For now, we'll just update the issue in the parent component
        onUpdate();
      }
      
      toast.success("Issue updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to update issue:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update issue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Issue Details</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter issue title"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter issue description"
              rows={4}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as IssueStatus)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch("priority")}
                onValueChange={(value) => setValue("priority", value as IssuePriority)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
