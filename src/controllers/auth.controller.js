import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerUser, loginUser } from "../services/auth.service.js";

export const register = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body; 
  const { user, token } = await registerUser({ name, email, password });
  res
    .status(201)
    .json(new ApiResponse(201, { user, token }, "Account created"));
});

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const { user, token } = await loginUser({ email, password });
  res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

export const logout = AsyncHandler(async (_req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});