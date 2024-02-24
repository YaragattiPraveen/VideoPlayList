import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new errorHandler(409, "All feilds are required!");
  }
  return res
    .status(200)
    .json(new responseHandler(200, "This is the testing register route"));
});

export { registerUser };
