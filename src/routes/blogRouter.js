const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute");
const { validatePostBlog, validateBlogId } = require("../middlewares/validators/blogValidator");
const { handleValidationErrors } = require("../middlewares/handleValidationErrors");
const { postBlog, getBlogs, getBlogDetails, deleteBlog } = require("../controllers/blogController");

const blogRouter = express.Router();

blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getBlogDetails);
blogRouter.post("/",protectRoute, validatePostBlog, handleValidationErrors, postBlog);
blogRouter.delete("/:id", protectRoute, deleteBlog);
module.exports = blogRouter;