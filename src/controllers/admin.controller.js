import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import {
  listUsersQuery,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  listAllNotesQuery,
  getUsersGroupedByInterests,
} from "../services/admin.service.js";

export const listUsersHandler = AsyncHandler(async (req, res) => {
  const { page, limit, sort } = req.validated.query;

  const features = new ApiFeatures(
    listUsersQuery(),
    { sort, page, limit },
    {
      allowedSortFields: ["createdAt", "updatedAt"],
      maxLimit: 50,
    },
  )
    .sort()
    .paginate();

  const results = await features.query;
  const total = await User.countDocuments({});

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
      "Users retrieved",
    ),
  );
});

export const createUserHandler = AsyncHandler(async (req, res) => {
  const user = await adminCreateUser(req.validated.body);

  res.status(201).json(new ApiResponse(201, user, "User created"));
});

export const updateUserHandler = AsyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const updates = req.validated.body;

  const user = await adminUpdateUser({ userId: id, updates });

  res.status(200).json(new ApiResponse(200, user, "User updated"));
});

export const deleteUserHandler = AsyncHandler(async (req, res) => {
  const { id } = req.validated.params;

  await adminDeleteUser({ userId: id, currentUserId: req.user.id });

  res.status(200).json(new ApiResponse(200, null, "User deleted"));
});

export const listAllNotesHandler = AsyncHandler(async (req, res) => {
  const { page, limit, sort } = req.validated.query;

  const features = new ApiFeatures(
    listAllNotesQuery(),
    { sort, page, limit },
    {
      allowedSortFields: ["createdAt", "updatedAt"],
      maxLimit: 50,
    },
  )
    .sort()
    .paginate();

  const results = await features.query;
  const total = await Note.countDocuments({});

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
      "All notes retrieved",
    ),
  );
});

export const usersByInterestsHandler = AsyncHandler(async (_req, res) => {
  const results = await getUsersGroupedByInterests();

  res
    .status(200)
    .json(new ApiResponse(200, results, "Users grouped by interests"));
});
