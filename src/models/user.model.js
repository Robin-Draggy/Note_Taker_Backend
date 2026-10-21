import mongoose from "mongoose";
import { ROLES } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
      required: true,
    },

    interests: {
      type: [String],
      default: [],
      set: (interests) => (interests ?? []).map((i) => i.trim().toLowerCase()),
    },
  },
  {
    timestamps: true,
  },
);

// Required for unique emails and login lookups.
userSchema.index({ email: 1 }, { unique: true });

// Supports paginated admin user lists sorted by creation date.
userSchema.index({ createdAt: -1 });

// Supports filtering users by interest.
userSchema.index({ interests: 1 });

export const User = mongoose.model("User", userSchema);
