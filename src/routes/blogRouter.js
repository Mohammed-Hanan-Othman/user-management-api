const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute");
const { validatePostBlog, validateBlogId } = require("../middlewares/validators/blogValidator");
const { handleValidationErrors } = require("../middlewares/handleValidationErrors");
const { postBlog, getBlogs, getBlogDetails, deleteBlog, updateBlog } = require("../controllers/blogController");

const blogRouter = express.Router();

blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getBlogDetails);
blogRouter.post("/",protectRoute, validatePostBlog, handleValidationErrors, postBlog);
blogRouter.put("/:id",  protectRoute, validateBlogId, validatePostBlog, handleValidationErrors, updateBlog);
blogRouter.delete("/:id", protectRoute, deleteBlog);

module.exports = blogRouter;