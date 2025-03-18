require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Initial default route
app.get("/", (req, res) => {
    res.status(200).send("User Management API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`SERVER is running on port ${PORT}`);
});