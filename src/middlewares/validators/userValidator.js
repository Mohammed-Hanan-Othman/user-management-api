const { check } = require("express-validator");
const validatePostUser = [    
    check("name").notEmpty().trim().withMessage("Name cannot be empty"),
    check("email").notEmpty().trim().withMessage("Email cannot be empty")
        .isEmail().withMessage("Email is invalid"),
    check("role").notEmpty().trim().withMessage("Role cannot be empty")
        .isIn(["user","admin"]).withMessage("Role must be user or admin"),
    check("password").notEmpty().trim().withMessage("Password cannot be empty")
        .isLength({min: 6}).withMessage("Password must be at least 6 characters long")
];
const validateUpdateUser = [
    check("name").notEmpty().trim().withMessage("Name cannot be empty"),
    check("email").notEmpty().trim().withMessage("Email cannot be empty")
        .isEmail().withMessage("Email is invalid")
];
module.exports = {
    validatePostUser,
    validateUpdateUser
};