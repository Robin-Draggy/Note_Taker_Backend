import { Router } from "express";

import {
  createPostHandler,
  listPostsByUserHandler,
} from "../controllers/post.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createPostSchema,
  postUserIdParamSchema,
  listPostsQuerySchema,
} from "../validations/post.validation.js";

export const router = Router();

router.get(
  "/user/:userId",
  validate(postUserIdParamSchema),
  validate(listPostsQuerySchema),
  listPostsByUserHandler,
);

router.post("/", authenticate, validate(createPostSchema), createPostHandler);
