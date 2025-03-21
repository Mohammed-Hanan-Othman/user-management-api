require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const DB_SALT = parseInt(process.env.DB_SALT);
const prisma = new PrismaClient();

const getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, email, name } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        if (page < 1 || limit < 1) {
            return res.status(400).json({ 
                message: "Page and limit must be positive values"
            });
        }
        // Set filters
        let where = {};
        if (email) where["email"] = { contains: email };
        if (name) where["name"] = { contains: name };
        // Get all users
        const users = await prisma.user.findMany({
            where,
            take : limit,
            skip : (page - 1) * limit,
            orderBy: {createdAt: "desc"},
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
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,DB_SALT);
        const newUser = await prisma.user.create({
            data: {name, email, password: hashedPassword},
            omit: {password: true}
        });
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