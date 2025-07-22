import { z } from "zod";

export const TaskStatuses = ["todo", "in_progress", "done"] as const;
export const TaskPriorities = ["low", "medium", "high"] as const;

export const taskFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  dueDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid date format",
  }),
  status: z.enum(TaskStatuses),
  priority: z.enum(TaskPriorities),
  memberId: z.number().min(1, "Please assign to a member"),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;