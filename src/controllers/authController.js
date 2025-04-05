require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { getUserByEmail, getUserById } = require("../services/userService");
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const ACCESS_TOKEN_EXPIRY = "1min";
const REFRESH_TOKEN_EXPIRY = "5min";

const postLogin = async (req, res) => {
    try {
        // Validate email & password input.
        let { email, password } = req.body;
        email = email.trim().toLowerCase();
        
        // Check if the user exists.
        const user = await getUserByEmail(email, false);
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
        const jti = crypto.randomUUID();
        const accessToken = jwt.sign(userData, JWT_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRY});
        const refreshToken = jwt.sign({...userData, jti}, REFRESH_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRY});
        
        // Set refresh token as cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: SEVEN_DAYS,
            path: "/",
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
        // Check if access token is still valid
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            try {
                jwt.verify(token, JWT_SECRET);
                return res.status(400).json({ message: "Access token is still valid" });
            } catch (err) {
                if (err.name !== "TokenExpiredError") {
                    return res.status(400).json({ message: "Invalid access token" });
                }
            }
        } else {
            return res.status(400).json({ message: "Access token not provided"});
        }

        // Obtain refresh token
        let refreshToken = req.cookies?.refreshToken;
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
        
        // Generate new access token
        const {id, name, email, role} = userData;
        const accessToken = jwt.sign({ id, name, email, role }, JWT_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRY});
        
        // Generate new refresh token
        const jti = crypto.randomUUID();
        refreshToken = jwt.sign({ id, name, email, role, jti }, REFRESH_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRY});
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: SEVEN_DAYS,
            path: "/",
            sameSite: "Strict"
        });
        return res.status(200).json({ message: "Token refreshed successfully", accessToken });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const postLogout = async (req, res) =>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "User not already logged in." });
        }
        // Clear refresh cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            path: "/",
            sameSite: "Strict"
        });
        
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = {
    postLogin,
    postRefresh,
    postLogout
};