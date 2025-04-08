const { createBlog, getAllBlogs, getBlogsCount } = require("../services/blogService");
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
const getBlogs = async (req, res) =>{
    try {
        let { page = 1, limit = 10, title, content, sortBy = "createdAt", order = "desc", search=" " } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        if (page < 1 || limit < 1) {
            return res.status(400).json({ 
                message: "Page and limit must be positive values"
            });
        }
        // Set filters
        let filters = search ? {
            OR: [
                    { title : { contains: search, mode: "insensitive"} },
                    { content : { contains: search, mode: "insensitive"} }
            ]
        }:{};
        if (title) filters["title"] = { contains: title };
        if (content) filters["content"] = { contains: content };
        if (filters.OR.length === 0) delete filters.OR;

        // Validate order
        const validOrder = ["asc", "desc"];
        if (!validOrder.includes(order.toLowerCase())) {
            return res.status(400).json({ 
                message: "Invalid order value. Use 'asc' or 'desc'." 
            });
        }
        // Create sort order
        let orderBy = [];
        if (Array.isArray(sortBy)){
            orderBy = sortBy.map(item => ({ [item]: order.toLowerCase() }));
        } else {
            orderBy = [{ [sortBy] : order.toLowerCase() }]
        }

        const options = { page, limit, orderBy }
        // Get all blogs
        const blogs = await getAllBlogs(filters, options)

        // Generate metadata
        const totalBlogs = await getBlogsCount(filters);
        const totalPages = Math.ceil(totalBlogs / limit);
        const metadata = {
            total_records : totalBlogs,
            total_pages: totalPages,
            current_page: page,
            limit,
        };
        return res.status(200).json({
            message: "Fetched blogs successfully",
            metadata,
            data: blogs
        });
    } catch (error) {
        console.error("Error fetching blogs:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = {
    postBlog,
    getBlogs
}