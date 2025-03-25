const prisma = require("../config/prisma");

const getAllUsers = async (filters, options) =>{
    const { page, limit, orderBy } = options;
    return await prisma.user.findMany({
        where: filters,
        take : limit,
        skip : (page - 1) * limit,
        orderBy,
        omit: { password: true }
    });
}
const getUserById = async (id, hidePassword = true) =>{
    return await prisma.user.findUnique({ 
        where: { id },
        omit: hidePassword ? { password: true} : undefined
    });
}
const getUserByEmail = async (email, hidePassword = true) => {
    return await prisma.user.findUnique({
        where: { email },
        omit: hidePassword ? { password: true} : undefined
    });
}
const getUserCount = async (filters) =>{
    return await prisma.user.count({ where : filters });
}
const createNewUser = async (data) => {
    return await prisma.user.create({ data, omit: { password: true }});
}
const updateExistingUser = async (data, id, hidePassword = true) =>{
    return await prisma.user.update({
        data, 
        where: { id },
        omit: hidePassword? { password: true } : undefined
    });
}
module.exports = {
    getAllUsers,
    getUserCount,
    getUserByEmail,
    getUserById,
    createNewUser,
    updateExistingUser
}