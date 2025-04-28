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
const getBlogById = async (id) =>{
    return await prisma.blog.findUnique({
        where: { id },
        include : {
            user :  { omit : { password: true, createdAt: true, updatedAt: true } }
        }
    });
}
const deleteBlogById = async (id) =>{
    return await prisma.blog.delete({
        where: { id },
        include : {
            user :  { omit : { id: true, password: true, createdAt: true, updatedAt: true } }
        }
    });
};
const updateSingleBlog = async (data, id) =>{
    return await prisma.blog.update({
        where: { id }, 
        data,
        include : {
            user :  { omit : { id: true, password: true, createdAt: true, updatedAt: true } }
        }
    });
};
module.exports = {
    getBlogsCount,
    createBlog,
    getAllBlogs,
    getBlogById,
    deleteBlogById,
    updateSingleBlog
};