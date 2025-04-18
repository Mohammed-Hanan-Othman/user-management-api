const prisma = require("../config/prisma");

const getBlogsCount = async (filters = {}) =>{
    return await prisma.blog.count({ 
        where : filters 
    });
};
const createBlog = async (data) => {
    return await prisma.blog.create({
        data, 
        include : {
            user :  { omit : { password: true, createdAt: true, updatedAt: true } }
        }
    });
};
const getAllBlogs = async (filters, options) => {
    const { page, limit, orderBy } = options
    return await prisma.blog.findMany({
        where: filters,
        take: limit,
        skip: (page - 1) * limit,
        orderBy,
    });
};

module.exports = {
    getBlogsCount,
    createBlog,
    getAllBlogs,
};