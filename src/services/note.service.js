import { ApiError } from "../utils/ApiError.js";
import {
  createNoteRepo,
  findNoteByIdRepo,
  findNotesByOwnerQuery,
  updateNoteByIdRepo,
  deleteNoteByIdRepo,
} from "../repositories/note.repository.js";


const assertOwner = (note, userId) => {
  if (!note.owner.equals(userId)) {
    // 404 not 403: don't reveal that the note exists to non-owners
    throw new ApiError(404, "Note not found");
  }
};


export const createNote = async ({ userId, title, content }) => {
  const note = await createNoteRepo({
    owner: userId,         
    title,
    content,
  });

  return note;
};


export const getNoteById = async ({ noteId, userId }) => {
  const note = await findNoteByIdRepo(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  assertOwner(note, userId);

  return note;
};


export const getNotesQuery = ({ userId }) => {
  return findNotesByOwnerQuery(userId);
};


export const updateNote = async ({ noteId, userId, updates }) => {
  const note = await findNoteByIdRepo(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  assertOwner(note, userId);

  const updated = await updateNoteByIdRepo(noteId, updates);

  return updated;
};


export const deleteNote = async ({ noteId, userId }) => {
  const note = await findNoteByIdRepo(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  assertOwner(note, userId);

  await deleteNoteByIdRepo(noteId);
};