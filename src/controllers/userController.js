const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        console.log(page < 1 || limit < 1);
        if (page < 1 || limit < 1) {
            return res.status(400).json({ 
                message: "Page and limit must be positive values"
            });
        }
        // Get all users
        const users = await prisma.user.findMany({
            take : limit,
            skip : (page - 1) * limit,
            orderBy: {createdAt : "desc"},
            omit: { password: true }
        });

        // Generate metadata
        const totalUsers = await prisma.user.count();
        const totalPages = Math.ceil(totalUsers / limit);
        const metadata = {
            total_records : totalUsers,
            total_pages: totalPages,
            current_page: page,
            limit,
        };
        res.status(200).json({
            message: "Fetched users successfully",
            metadata,
            data: users
        });
    } catch (error) {
        console.log("Error fetching users", error);
        return res.status(500).send("Internal Server Error");
    }
}
const createUser = async (req, res) => {
    try {
        // Create user
    } catch (error) {
        console.log("Error creating user", error);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getUsers
};