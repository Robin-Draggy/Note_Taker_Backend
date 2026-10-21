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

export const createNoteSchema = z.object({
  body: z.object({
    title: titleSchema,
    content: contentSchema,
  }),
});

export const updateNoteSchema = z.object({
  body: z
    .object({
      title: titleSchema.optional(),
      content: contentSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field (title or content) must be provided",
    }),
});

export const listNotesQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sort: z
      .string()
      .regex(
        /^-?(createdAt|updatedAt)$/,
        "sort must be createdAt or updatedAt, optionally prefixed with -",
      )
      .default("-createdAt"),
    fields: z
      .string()
      .regex(
        /^[a-zA-Z_][a-zA-Z0-9_]*(,[a-zA-Z_][a-zA-Z0-9_]*)*$/,
        "fields must be comma-separated field names",
      )
      .optional(),
  }),
});

export const noteIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid note id"),
  }),
});
