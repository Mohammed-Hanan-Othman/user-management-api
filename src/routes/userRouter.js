const express = require("express");
const { check, validationResult } = require("express-validator");
const { getUsers, createUser } = require("../controllers/userController");

const validatePostUser = [
    // name, email, password
    check("name").notEmpty().trim().withMessage("Name cannot be empty"),
    check("email").notEmpty().trim().withMessage("Email cannot be empty")
        .isEmail().withMessage("Email is invalid"),
    check("password").notEmpty().trim().withMessage("Password cannot be empty")
        .isLength({min: 6}).withMessage("Password must be at least 6 characters long")
];
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
}
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/",validatePostUser,handleValidationErrors,createUser);


module.exports = userRouter;