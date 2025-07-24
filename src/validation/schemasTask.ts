import { z } from "zod";

export const TaskStatuses = ["todo", "in_progress", "done"] as const;
export const TaskPriorities = ["low", "medium", "high"] as const;

export const taskFormSchema = z.object({
  id: z.number().optional(),
  title: z.string()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  dueDate: z.string()
    .refine(val => !isNaN(new Date(val).getTime()), {
      message: "Format de date invalide (YYYY-MM-DD)"
    })
    .refine(val => new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "La date ne peut pas être dans le passé"
    }),
  status: z.enum(TaskStatuses, {
    errorMap: () => ({ message: "Statut invalide" })
  }),
  priority: z.enum(TaskPriorities, {
    errorMap: () => ({ message: "Priorité invalide" })
  }),
  memberId: z.number().min(1, "Veuillez assigner un membre"),
});
export type TaskFormData = z.infer<typeof taskFormSchema>;