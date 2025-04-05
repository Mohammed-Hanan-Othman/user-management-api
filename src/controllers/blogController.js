const { createBlog } = require("../services/blogService");
const { getUserById } = require("../services/userService");

const postBlog = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;
        // Get user
        const user = await getUserById(userId);
        // Check if user is admin or throw error
        if (!user || user.role.toLowerCase() !== "admin") {
            return res.status(401).json({ message: "Only admins can create blogs"});
        }
        // Create blog post
        const data = { title, content, userId }
        const blog = await createBlog(data);

        // Send response to frontend
        return res.status(201).json({ 
            message: "Blog post created successfully", 
            data: blog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json({ message: "Internal Server Error" });   
    }
};

module.exports = {
    postBlog
}