
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
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

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Supports retrieving a user's posts in newest-first order.
postSchema.index({ author: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);