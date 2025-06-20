"use client";

import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organization";
import { issueSchema } from "@/lib/validators";

import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  imageUrl?: string | null;
}

interface IssueFormData {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assigneeId: string;
}

interface CreateIssueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  status: string;
  projectId: string;
  orgId: string;
  onIssueCreated: () => void;
}

export default function CreateIssueDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}: CreateIssueDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen && orgId) {
        try {
          setIsLoadingUsers(true);
          const usersData = await getOrganizationUsers(orgId);
          setUsers(usersData || []);
        } catch (err) {
          setError("Failed to load users");
          console.error("Error fetching users:", err);
        } finally {
          setIsLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [isOpen, orgId]);

  const onSubmit: SubmitHandler<IssueFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await createIssue(projectId, {
        ...data,
        status,
        sprintId,
      });

      reset();
      onIssueCreated();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create issue';
      setError(errorMessage);
      console.error('Error creating issue:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="h-[90vh] max-h-screen">
        <div className="max-w-2xl mx-auto w-full h-full flex flex-col">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-xl">Create New Issue</DrawerTitle>
          </DrawerHeader>
          
          {isLoadingUsers ? (
            <div className="flex-1 flex items-center justify-center">
              <BarLoader width={200} color="#36d7b7" />
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <Input 
                    id="title" 
                    {...register("title")} 
                    disabled={isSubmitting}
                    className="w-full"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="assigneeId"
                      className="block text-sm font-medium mb-1"
                    >
                      Assignee *
                    </label>
                    <Controller
                      name="assigneeId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  {user.imageUrl && (
                                    <img 
                                      src={user.imageUrl} 
                                      alt={user.name || ''} 
                                      className="h-5 w-5 rounded-full"
                                    />
                                  )}
                                  <span>{user.name || user.email}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.assigneeId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.assigneeId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium mb-1"
                    >
                      Priority *
                    </label>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description *
                  </label>
                  <div className="border rounded-md overflow-hidden">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <MDEditor 
                          value={field.value || ''} 
                          onChange={field.onChange}
                          className="min-h-[150px] max-h-[200px] overflow-y-auto"
                        />
                      )}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>


              <div className="p-4 border-t flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : 'Create Issue'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}