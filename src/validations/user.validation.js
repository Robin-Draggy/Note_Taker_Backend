import { z } from "zod";

export const publicListUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    sort: z
      .string()
      .regex(/^-?(createdAt|updatedAt)$/)
      .default("createdAt"),
  }),
});
