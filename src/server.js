require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errorMiddleware");
const { PrismaClient } = require("@prisma/client");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const blogRouter = require("./routes/blogRouter");
const TEN_MINUTES = 10 * 60 * 1000;

const app = express();

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Logging
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
    windowMs: TEN_MINUTES,
    max: 30,
    message: "Too many requests, please try again later."
});
app.use(limiter);

// Request parsers
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Handle cookies
app.use(cookieParser());

// Test db connection
const prisma = new PrismaClient();
async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}
testDB();

//Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", blogRouter);
app.get("/", (req, res) => {
    res.status(200).send("User Management API is running");
});

// Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`SERVER is running on port ${PORT}`);
});