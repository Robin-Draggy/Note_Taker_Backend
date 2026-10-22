import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createPost, getPostsByUser } from "../services/post.service.js";


export const createPostHandler = AsyncHandler(async (req, res) => {
  const { title, content } = req.validated.body;

  const post = await createPost({
    userId: req.user.id,
    title,
    content,
  });

  res.status(201).json(new ApiResponse(201, post, "Post created"));
});


export const listPostsByUserHandler = AsyncHandler(async (req, res) => {
  const { userId } = req.validated.params;
  const { page, limit, sort } = req.validated.query;

  const [result] = await getPostsByUser({ userId, page, limit, sort });

  const total = result.totalCount[0]?.count ?? 0;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        results: result.results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Posts retrieved"
    )
  );
});