require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const DB_SALT = parseInt(process.env.DB_SALT);
const prisma = new PrismaClient();
const {getAllUsers, getUserCount, createNewUser} = require("../services/userService");


const getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, email, name, sortBy = "createdAt", order = "desc", search } = req.query;
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
                    { name : { contains: search, mode: "insensitive"} },
                    { email : { contains: search, mode: "insensitive"} }
            ]
        }:{};
        if (email) filters["email"] = { contains: email };
        if (name) filters["name"] = { contains: name };
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
        const options = {
            page, limit, orderBy
        }
        // Get all users
        const users = await getAllUsers(filters, options);

        // Generate metadata
        const totalUsers = await getUserCount(filters);
        const totalPages = Math.ceil(totalUsers / limit);
        const metadata = {
            total_records : totalUsers,
            total_pages: totalPages,
            current_page: page,
            limit,
        };
        return res.status(200).json({
            message: "Fetched users successfully",
            metadata,
            data: users
        });
    } catch (error) {
        console.log("Error fetching users", error);
        return res.status(200).json({
            message: "Internal server error",
        })
    }
}
const createUser = async (req, res) => {
    try {
        // Create user
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,DB_SALT);
        const data = {name, email, password: hashedPassword}
        
        const newUser = await createNewUser(data);

        return res.status(201).json({
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        console.log("Error creating user", error);
        return res.status(500).send("Internal Server Error");
    }
}
module.exports = {
    getUsers,
    createUser
};