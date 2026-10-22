import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";

export const listPublicUsersHandler = AsyncHandler(async (req, res) => {
  const { page, limit, sort } = req.validated.query;

  const features = new ApiFeatures(
    User.find({}).select("_id name"),
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
