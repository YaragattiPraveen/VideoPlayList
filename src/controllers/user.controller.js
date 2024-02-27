import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";
import uploadCloudinary from "../utils/fileUploadCloudinary.js";
import User from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    if (!accessToken && !refreshToken) {
      throw new errorHandler(500, "Unable to genearate the tokens");
    }

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new errorHandler(
      500,
      "Something is went wrong while generating the access and refresh token"
    );
  }
};

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
  const avatarLocalPath = req?.files?.avatar[0]?.path;

  let converImageLocalPath;
  if (
    req?.files &&
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
    .json(
      new responseHandler(200, createdUser, "User is registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  // extract the user info from req
  // check empty data in user info
  // check whether is registered in the db
  // verify the password
  // generate the access and refresh token
  // send the access and refresh token through cookies

  const { username, email, password } = req.body;

  if ((!username || !email) && !password) {
    throw new errorHandler(
      400,
      "All fields are required please enter the username or email and password to login"
    );
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new errorHandler(404, "User is not found");
  }

  const validPassword = await user.isPasswordCorrect(password);

  if (!validPassword) {
    throw new errorHandler(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new responseHandler(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User is logged in successfully"
      )
    );
});

export { registerUser, loginUser };
