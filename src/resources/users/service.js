import {User, Profile} from "../../database/models";
import createError from 'http-errors'
import bcrypt from 'bcryptjs';

async function addNewUser(user) {
    user.password =  await bcrypt.hash(user.password, parseInt(process.env.PASSWORD_ROUNDS));

    return User.create(user).then(async (createdUser) => {
        const emptyProfile = {
            username: user.login,
            role: user.isAdmin ? 'admin' : 'user',
            location: 'N/A',
            contact: 'N/A',
            user_id: createdUser.id,
        };
        await Profile.create(emptyProfile);
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