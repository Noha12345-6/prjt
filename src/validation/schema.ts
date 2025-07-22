import { z } from "zod";

export const MemberRoles = [
  "Developer",
  "Designer",
  "Manager",
  "QA Engineer",
  "Product Owner",
] as const;

export const MemberStatuses = ["active", "inactive"] as const;

export const memberFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(MemberRoles), // Retirez .optional() car le rôle doit toujours être défini
  joinDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, {
    message: "Invalid date format, expected YYYY-MM-DD",
  }),
  status: z.enum(MemberStatuses),
});

export type MemberFormData = z.infer<typeof memberFormSchema>;