import {User} from "../../database/models";
import createError from 'http-errors';

import jwt from 'jsonwebtoken';

const bcrypt = require('bcryptjs');
import logger from "../../common/logger";

function generateAuthToken(user){
    return jwt.sign({id: user.id}, process.env.JWT_KEY,
        {expiresIn: parseInt(process.env.JWT_LIFETIME), noTimestamp: true});
}


async function acquireToken(fromURLencoded) {
    const user = await User.findOne({where: {login: fromURLencoded.login}});
    logger.debug(`Processing user: ${user.login} (id: ${user.id})`);
    if (!user) {
        logger.debug(`User not found in DB`);
        throw createError(403, "Invalid user or password")
    }
    const match = await bcrypt.compare(fromURLencoded.password, user.password);
    if (!match) {
        logger.debug(`Passwords missmatch`);
        throw createError(403, "Invalid user or password");
    }
    const token = generateAuthToken(user);
    logger.info(`Creating token with lifetime ${process.env.JWT_LIFETIME} sec. for user ${user.login} (id: ${user.id})`);
    return {
        user_id: user.id,
        token: token
    }
}

export default {
    acquireToken,
}