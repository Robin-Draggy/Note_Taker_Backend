import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be at most 200 characters");

const contentSchema = z
  .string()
  .min(1, "Content is required")
  .max(50000, "Content is too long");

export const createPostSchema = z.object({
  body: z.object({
    title: titleSchema,
    content: contentSchema,
  }),
});

export const postUserIdParamSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid user id"),
  }),
});

export const listPostsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sort: z
      .string()
      .regex(/^-?(createdAt|updatedAt)$/)
      .default("-createdAt"),
  }),
});
