import { z } from "zod";
import { ROLES } from "../config/constants.js";

const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid user id"),
  }),
});

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(254);

const nameSchema = z
  .string()
  .trim()
  .min(2)
  .max(100);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128);

const interestsSchema = z
  .array(z.string().trim().toLowerCase().min(1).max(50))
  .max(20, "Too many interests")
  .optional();

export const adminCreateUserSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum([ROLES.USER, ROLES.ADMIN]).default(ROLES.USER),
    interests: interestsSchema,
  }),
});

export const adminUpdateUserSchema = z.object({
  body: z
    .object({
      name: nameSchema.optional(),
      role: z.enum([ROLES.USER, ROLES.ADMIN]).optional(),
      interests: interestsSchema,
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
});

export const adminUserIdParamSchema = userIdParamSchema;

export const adminListUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sort: z
      .string()
      .regex(/^-?(createdAt|updatedAt)$/)
      .default("-createdAt"),
  }),
});

export const adminListNotesQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sort: z
      .string()
      .regex(/^-?(createdAt|updatedAt)$/)
      .default("-createdAt"),
  }),
});