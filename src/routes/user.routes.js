import { Router } from "express";
import {
  changeCurrentUserPassword,
  getCurrentUserDetails,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateProfileDetails,
  updateUserProfileCoverImage,
  updateUserProfileImage,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import validateUserRegister from "../validators/userRegister.validator.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  validateUserRegister(),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/refreshaccesstoken").post(refreshAccessToken);
// Protected Routes
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/changepassword").post(authMiddleware, changeCurrentUserPassword);
router.route("/getuserdetails").get(authMiddleware, getCurrentUserDetails);
router.route("/updateprofile").post(authMiddleware, updateProfileDetails);
router.route("/updatecoverimg").post(
  upload.single("coverImage"),
  authMiddleware,
  updateUserProfileCoverImage
);
router
  .route("/updateavatarimg")
  .post(upload.single("avatar"), authMiddleware, updateUserProfileImage);

export default router;
