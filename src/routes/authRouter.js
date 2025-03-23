const express = require("express");
const { validateLogin } = require("../middlewares/validators/authValidator");
const { handleValidationErrors } = require("../middlewares/handleValidationErrors");
const router = express.Router();

router.get("/", (req, res) =>{
    return res.status(200).json({message: "Fetching users...."});
});
router.post("/login", validateLogin, handleValidationErrors, (req, res) => {});

module.exports = router;