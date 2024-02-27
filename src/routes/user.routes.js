import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
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

// Protected Routes
router.route("/logout").post(authMiddleware, logoutUser);
export default router;
