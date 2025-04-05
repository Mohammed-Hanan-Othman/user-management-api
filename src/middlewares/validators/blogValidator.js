const { check } = require("express-validator");

const validatePostBlog = [
    check("title").trim().notEmpty().withMessage("Blog title cannot be empty")
        .isLength({ min: 20 }).withMessage("Title must be at least 20 characters long")
        .escape(),
    check("content").trim().notEmpty().withMessage("Content cannot be empty")
        .custom((value) => {
            const wordCount = value.trim().split(/\s+/).length;
            // set the limit as 5 for easier testing
            if (wordCount < 5) {
                throw new Error('Content must have at least 5 words');
            }
            return true;
        }).escape(),
];

module.exports = {
    validatePostBlog
}
