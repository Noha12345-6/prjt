import { zodResolver } from "@hookform/resolvers/zod";
import { memberFormSchema } from "./schema";

export const memberFormResolver = zodResolver(memberFormSchema);