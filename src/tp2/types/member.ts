import { z } from 'zod';

export const memberSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
  status: z.string(),
  joinDate: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export type Member = z.infer<typeof memberSchema>; 