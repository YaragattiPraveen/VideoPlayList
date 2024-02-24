import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";
import uploadCloudinary from "../utils/fileUploadCloudinary.js";
import User from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validating on the user data
  // check if user is existing (Need to check user and email as well)
  // check for images, check for avatar
  // upload them to cloudinary
  // create a user object - saving the data in db
  // removing the password from the response
  // check for user creation

  const { username, email, password, fullname } = req.body;

  if (
    [username, email, password, fullname].some(
      (field) => field === undefined || field?.trim() === ""
    )
  ) {
    throw new errorHandler(400, "All fields are required");
  }


  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new errorHandler(409, "Already email or username is existing");
  }

  // Getting the file name path which is stored in local file
  const avatarLocalPath = req.files?.avatar[0]?.path;

  let converImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    converImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new errorHandler(400, "Avatar file is required");
  }

  // uploading the file to cloudinary
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(converImageLocalPath);

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new errorHandler(
      500,
      "Something went wrong while registering the user"
    );
  }

  return res
    .status(201)
    .json(responseHandler(200, createdUser, "User is registered Successfully"));
});

export { registerUser };
