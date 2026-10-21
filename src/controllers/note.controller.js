import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import {
  createNote,
  getNoteById,
  getNotesQuery,
  updateNote,
  deleteNote,
} from "../services/note.service.js";


export const createNoteHandler = AsyncHandler(async (req, res) => {
  const { title, content } = req.validated.body;

  const note = await createNote({
    userId: req.user.id,
    title,
    content,
  });

  res
    .status(201)
    .json(new ApiResponse(201, note, "Note created"));
});


export const listNotesHandler = AsyncHandler(async (req, res) => {
  const { page, limit, sort, fields } = req.validated.query;

  let query = getNotesQuery({ userId: req.user.id });

  const features = new ApiFeatures(query, { sort, fields, page, limit }, {
    allowedSortFields: ["createdAt", "updatedAt"],
    allowedFields: ["title", "content", "createdAt", "updatedAt"],
    maxLimit: 50,
  })
    .sort()
    .select()
    .paginate();

  const results = await features.query;

  const total = await features.query.model.countDocuments({ owner: req.user.id });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
        pagination: {
          ...features.pagination,
          total,
          totalPages: Math.ceil(total / features.pagination.limit),
        },
      },
      "Notes retrieved"
    )
  );
});


export const getNoteHandler = AsyncHandler(async (req, res) => {
  const { id } = req.validated.params;

  const note = await getNoteById({
    noteId: id,
    userId: req.user.id,
  });

  res.status(200).json(new ApiResponse(200, note, "Note retrieved"));
});


export const updateNoteHandler = AsyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const updates = req.validated.body;

  const note = await updateNote({
    noteId: id,
    userId: req.user.id,
    updates,
  });

  res.status(200).json(new ApiResponse(200, note, "Note updated"));
});


export const deleteNoteHandler = AsyncHandler(async (req, res) => {
  const { id } = req.validated.params;

  await deleteNote({
    noteId: id,
    userId: req.user.id,
  });

  res.status(200).json(new ApiResponse(200, null, "Note deleted"));
});