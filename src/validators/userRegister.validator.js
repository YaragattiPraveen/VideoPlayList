import { body, validationResult } from "express-validator";
import { errorHandler } from "../utils/errorHandler.js";

const validateUserRegister = () => {
  return [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").trim().isEmail().withMessage("Invalid email address"),
    body("fullname").trim().notEmpty().withMessage("Full name is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be more then 6 character"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new errorHandler(400, "All fields are required", errors.array());
      }
      next();
    },
  ];
};

export default validateUserRegister;
