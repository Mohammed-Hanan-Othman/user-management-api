require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const protectRoute = async (req, res, next) => {
    const headerText = req.headers["authorization"];
    if (!headerText || !headerText.startsWith("Bearer")) {
        return res.status(401).json({ message: "Access unauthorized" });
    }
    const token = headerText.split(" ")[1];
    try {
        const user = jwt.verify(token, JWT_SECRET);
        if (!user) {
            return res.status(400).json({ message: "Token invalid or expired" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Token invalid or expired" });
    }
}

module.exports = { protectRoute };