require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../services/userService");
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const postLogin = async (req, res) => {
    try {
        // Validate email & password input.
        let { email, password } = req.body;
        email = email.trim().toLowerCase();
        console.log({ email, password });
        
        // Check if the user exists.
        const user = await getUserByEmail(email, false);
        console.log(user);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Generate and return a JWT token.
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const accessToken = jwt.sign(userData, JWT_SECRET, {expiresIn: "1hr"});
        const refreshToken = jwt.sign(userData, REFRESH_SECRET, {expiresIn: "7d"});
        
        // Set refresh token as cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: SEVEN_DAYS,
            sameSite: "Strict"
        });
        return res.status(200).json({
            message: "Login successful",
            data: { ...userData, accessToken }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    postLogin,
};