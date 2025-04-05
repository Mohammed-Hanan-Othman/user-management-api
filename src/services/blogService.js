const prisma = require("../config/prisma");

const createBlog = async (data) => {
    return await prisma.blog.create({
        data, 
        include : {
            user :  { omit : { password: true, createdAt: true, updatedAt: true } }
        }
    });
};

module.exports = {
    createBlog,
};