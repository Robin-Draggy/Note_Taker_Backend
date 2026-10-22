import { ApiError } from "../utils/ApiError.js";
import { ROLES } from "../config/constants.js";
import { hashPassword } from "../utils/password.js";
import {
  createUserRepo,
  findAllUsersQuery,
  findUserByIdRepo,
  updateUserByIdRepo,
  deleteUserByIdRepo,
} from "../repositories/user.repository.js";
import { findAllNotesQuery } from "../repositories/note.repository.js";

export const listUsersQuery = () => findAllUsersQuery();

export const adminCreateUser = async ({
  name,
  email,
  password,
  role,
  interests,
}) => {
  const passwordHash = await hashPassword(password);

  try {
    const user = await createUserRepo({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      interests: interests ?? [],
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      interests: user.interests,
    };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      throw new ApiError(409, "An account with this email already exists.");
    }
    throw error;
  }
};

export const adminUpdateUser = async ({ userId, updates }) => {
  const user = await updateUserByIdRepo(userId, updates);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const adminDeleteUser = async ({ userId, currentUserId }) => {
  if (userId === currentUserId) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await deleteUserByIdRepo(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
};

export const listAllNotesQuery = () => findAllNotesQuery();

export const getUsersGroupedByInterests = async () => {
  const { User } = await import("../models/user.model.js");

  const results = await User.aggregate([
    { $unwind: "$interests" },
    {
      $group: {
        _id: "$interests",
        count: { $sum: 1 },
        users: {
          $push: {
            _id: "$_id",
            name: "$name",
            email: "$email",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return results;
};
