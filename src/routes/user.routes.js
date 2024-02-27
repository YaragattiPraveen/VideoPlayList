import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import validateUserRegister from "../validators/userRegister.validator.js";
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
export default router;
