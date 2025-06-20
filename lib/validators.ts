import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "project name is required"),
  key: z
    .string()
    .min(1, "project key is required")
    .max(10, "project key must be 10 character or less")
    .optional(),
  description: z.string().min(1, "project description is required").optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// sprint schema
export const sprintSchema = z.object({
  name: z.string().min(1, "sprint name is required"),
  description: z.string().min(1, "sprint description is required").optional(),
  startDate: z.date(),
  endDate: z.date(),
});

export type SprintInput = z.infer<typeof sprintSchema>;

// issue schema
export const issueSchema = z.object({
  title: z.string().min(1, "issue title is required"),
  description: z.string().min(1, "issue description is required").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),

  assigneeId: z
    .string()
    .cuid("please select assigne")
    .min(1, "issue assignee is required"),
});
export type IssueInput = z.infer<typeof issueSchema>;
