require("dotenv").config();
const bcrypt = require("bcryptjs");
const DB_SALT = parseInt(process.env.DB_SALT);
const { getAllUsers, getUserCount, createNewUser, getUserByEmail, updateExistingUser, getUserById } = require("../services/userService");


const getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, email, name, sortBy = "createdAt", order = "desc", search=" " } = req.query;
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
        console.error("Error fetching users:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
const createUser = async (req, res) => {
    try {
        // Obtain data from fields
        let { name, email, password, role } = req.body;
        name = name.trim();
        email = email.trim().toLowerCase();

        // Check if email is already in use.
        const user = await getUserByEmail(email);
        if (user) {
            return res.status(400).json({
                message: "Error. Email already in use."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, DB_SALT);
        const data = {name, email, password: hashedPassword, role}
        
        // Save new user
        const newUser = await createNewUser(data);

        return res.status(201).json({
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        console.error("Error creating user:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
const updateUser = async (req, res) => {
    try {
        // obtain id, name and email
        const id = req.params.id;
        let { name, email } = req.body;
        // ensure user exists
        const user = await getUserById(id);
        if (!user) {
            return res.status(400).json({ message: "No users found" });
        }
        if (req.user.id !== id) {
            return res.status(401).json({ 
                message: "Only the logged in user can edit account information" 
            });
        }
        // perform update
        const data = { name, email };
        const updatedUser = await updateExistingUser(data, id);
        return res.status(200).json({ 
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error creating user:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = {
    getUsers,
    createUser,
    updateUser
};