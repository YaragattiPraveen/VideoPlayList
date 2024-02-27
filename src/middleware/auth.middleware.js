import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async (req, _, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || "";

  if (!token) {
    throw new errorHandler(401, "Unauthorized request");
  }

  const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodeToken._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new errorHandler(401, "Invalid Access Token");
  }

  req.user = user;

  next();
});

export default authMiddleware;
