
import { z } from 'zod';
import { memberFormSchema } from "../../../validation/schema";


export { MemberRoles, MemberStatuses } from "../../../validation/schema";


export type Member = z.infer<typeof memberFormSchema> & { id: number };


export type MemberCreate = Omit<Member, "id">;
export type MemberUpdate = Partial<MemberCreate>;