const prisma = require("../config/prisma");

const getAllUsers = async (filters, options) =>{
    const {page, limit, orderBy} = options;
    return await prisma.user.findMany({
        where: filters,
        take : limit,
        skip : (page - 1) * limit,
        orderBy,
        omit: { password: true }
    });
}
const getUserByEmail = async (email, hidePassword = true) => {
    const options = {
        where: { email },
        omit: hidePassword ? { password: true} : undefined
    };

    return await prisma.user.findUnique(options);
};
const getUserCount = async (filters) =>{
    return await prisma.user.count({ where : filters });
}

const createNewUser = async (data) => {
    return await prisma.user.create({ data, omit: {password: true} });
}
module.exports = {
    getAllUsers,
    getUserCount,
    getUserByEmail,
    createNewUser
}