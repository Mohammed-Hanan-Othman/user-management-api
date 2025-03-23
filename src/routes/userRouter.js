const express = require("express");
const { getUsers, createUser } = require("../controllers/userController");
const { validatePostUser } = require("../middlewares/validators/userValidator");
const { handleValidationErrors } = require("../middlewares/handleValidationErrors");

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/", validatePostUser, handleValidationErrors, createUser);


module.exports = userRouter;