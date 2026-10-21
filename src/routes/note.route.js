import { Router } from "express";

import {
  createNoteHandler,
  listNotesHandler,
  getNoteHandler,
  updateNoteHandler,
  deleteNoteHandler,
} from "../controllers/note.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createNoteSchema,
  updateNoteSchema,
  listNotesQuerySchema,
  noteIdParamSchema,
} from "../validations/note.validation.js";

export const router = Router();

router.use(authenticate);

router.post("/", validate(createNoteSchema), createNoteHandler);

router.get("/", validate(listNotesQuerySchema), listNotesHandler);

router.get("/:id", validate(noteIdParamSchema), getNoteHandler);

router.patch(
  "/:id",
  validate(noteIdParamSchema),
  validate(updateNoteSchema),
  updateNoteHandler,
);

router.delete("/:id", validate(noteIdParamSchema), deleteNoteHandler);
