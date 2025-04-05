const express = require("express");
const { validateLogin } = require("../middlewares/validators/authValidator");
const { handleValidationErrors } = require("../middlewares/handleValidationErrors");
const { postLogin, postRefresh, postLogout } = require("../controllers/authController");
const router = express.Router();

router.get("/", (req, res) =>{
    return res.status(200).json({message: "Fetching users...."});
});
router.post("/login", validateLogin, handleValidationErrors, postLogin);
router.post("/refresh", postRefresh);
router.post("/logout", postLogout);

module.exports = router;