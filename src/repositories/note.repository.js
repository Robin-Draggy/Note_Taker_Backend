import { Note } from "../models/note.model.js";


export const createNoteRepo = (data) =>
  Note.create(data);


export const findNoteByIdRepo = (id) =>
  Note.findById(id);

export const findNotesByOwnerQuery = (ownerId) =>
  Note.find({ owner: ownerId });


export const updateNoteByIdRepo = (id, updateData) =>
  Note.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });


export const deleteNoteByIdRepo = (id) =>
  Note.findByIdAndDelete(id);