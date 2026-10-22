import { Router } from "express";

import {
  listUsersHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  listAllNotesHandler,
  usersByInterestsHandler,
} from "../controllers/admin.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { ROLES } from "../config/constants.js";

import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
  adminUserIdParamSchema,
  adminListUsersQuerySchema,
  adminListNotesQuerySchema,
} from "../validations/admin.validation.js";

export const router = Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get("/interests", usersByInterestsHandler);

router.get("/users", validate(adminListUsersQuerySchema), listUsersHandler);
router.post("/users", validate(adminCreateUserSchema), createUserHandler);
router.patch(
  "/users/:id",
  validate(adminUserIdParamSchema),
  validate(adminUpdateUserSchema),
  updateUserHandler,
);
router.delete(
  "/users/:id",
  validate(adminUserIdParamSchema),
  deleteUserHandler,
);

router.get("/notes", validate(adminListNotesQuerySchema), listAllNotesHandler);

