import { Router } from "express";
import { listPublicUsersHandler } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { publicListUsersQuerySchema } from "../validations/user.validation.js";

export const router = Router();

// Public — no auth required
router.get("/", validate(publicListUsersQuerySchema), listPublicUsersHandler);