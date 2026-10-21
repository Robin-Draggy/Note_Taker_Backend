
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
      maxlength: 50000,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Supports a user's notes list, sorted newest first.
// Also supports filtering notes by owner alone.
noteSchema.index({ owner: 1, createdAt: -1 });

// Supports the admin's global notes list, sorted newest first.
noteSchema.index({ createdAt: -1 });

export const Note = mongoose.model("Note", noteSchema);
