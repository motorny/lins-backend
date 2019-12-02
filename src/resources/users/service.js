import {User, Profile} from "../../database/models";
import createError from 'http-errors'
import bcrypt from 'bcryptjs';
import logger from "../../common/logger";
import Sequelize from "sequelize";

async function createEmptyProfile(forUser) {
    const emptyProfile = {
        username: forUser.login,
        location: 'N/A',
        contact: 'N/A',
        user_id: forUser.id,
    };
    logger.debug(`Creating empty profile for ${forUser.login}`);
    return Profile.create(emptyProfile);
}


async function addNewUser(userData) {
    logger.debug(`Creating new user ${userData.login}`);

    userData.password = await bcrypt.hash(userData.password, parseInt(process.env.PASSWORD_ROUNDS));

    const createdUser = await User.create(userData).catch((err) => {
        if (err instanceof Sequelize.UniqueConstraintError) {
            logger.info(`User ${userData.login} already exists`);
            throw createError(409, `Already exists`)
        } else {
            throw err;
        }
    });
    logger.info(`User ${createdUser.login} created. ID: ${createdUser.id}`);
    await createEmptyProfile(createdUser);
    return {
        message: 'Success',
        id: createdUser.id,
        login: createdUser.login
    };

}


async function changeUserRole(userID, isAdmin) {
    const user = await User.findByPk(userID);
    if (!user) {
        logger.debug(`User with id ${userID} not found`);
        throw createError(404, 'User not found');
    }
    await user.update({isAdmin: isAdmin});
    logger.info(`Changed ${user.login} role to: isAdmin-> ${isAdmin}`);
    return {
        message: 'Success',
        id: user.id,
        login: user.login,
        isAdmin: user.isAdmin
    };
}

export default {
    addNewUser,
    changeUserRole,
}