const express = require("express");
const { getUsers, createUser, updateUser } = require("../controllers/userController");
const { validatePostUser, validateUpdateUser } = require("../middlewares/validators/userValidator");
const { handleValidationErrors } = require("../middlewares/handleValidationErrors");
const { protectRoute } = require("../middlewares/protectRoute");

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/", validatePostUser, handleValidationErrors, createUser);
userRouter.put("/:id", protectRoute, validateUpdateUser, handleValidationErrors, updateUser);

module.exports = userRouter;