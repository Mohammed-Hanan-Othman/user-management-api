require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByEmail, getUserById } = require("../services/userService");
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
        const accessToken = jwt.sign(userData, JWT_SECRET, {expiresIn: "1min"});
        const refreshToken = jwt.sign(userData, REFRESH_SECRET, {expiresIn: "5min"});
        
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
const postRefresh = async (req, res) => {
    try {
        // Obtain refresh token
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token provided"});
        }

        // verify refresh token
        const userData = jwt.verify(refreshToken, REFRESH_SECRET);

        // Fetch user to ensure they still exist
        const user = await getUserById(userData.id);
        if (!user) {
            return res.status(403).json({ message: "User no longer exists" });
        }
        const {id, name, email, role} = userData;
        // Generate new access token
        const accessToken = jwt.sign({id, name, email, role}, JWT_SECRET, {expiresIn: "1min"});
        return res.status(200).json({ message: "Token refreshed successfully", accessToken });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = {
    postLogin,
    postRefresh
};