const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute");
const { validatePostBlog, validateBlogId } = require("../middlewares/validators/blogValidator");
const { handleValidationErrors } = require("../middlewares/handleValidationErrors");
const { postBlog, getBlogs } = require("../controllers/blogController");

const blogRouter = express.Router();

blogRouter.get("/", getBlogs);
blogRouter.post("/",protectRoute, validatePostBlog, handleValidationErrors, postBlog);
module.exports = blogRouter;