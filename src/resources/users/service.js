import {User} from "../../database/models";
import createError from 'http-errors'

async function addNewUser(user) {
    return User.create(user).then((createdUser) => {
        return {
            message: 'Success',
            id: createdUser.id
        };
    });
}


export async function getUserById(userID) {
    const user = await User.findByPk(userID, {attributes:['id','login']});
    if (!user)
        throw createError(404,'User not found');
    return user
}

export default {
    addNewUser,
    getUserById,
}