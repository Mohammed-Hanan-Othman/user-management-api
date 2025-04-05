const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute");
const { validatePostBlog } = require("../middlewares/validators/blogValidator");
const { handleValidationErrors } = require("../middlewares/handleValidationErrors");
const { postBlog } = require("../controllers/blogController");

const blogRouter = express.Router();

blogRouter.post("/",protectRoute, validatePostBlog, handleValidationErrors, postBlog);

module.exports = blogRouter;