import {User} from "../../database/models";
import createError from 'http-errors';

import jwt from 'jsonwebtoken';

const bcrypt = require('bcryptjs');
import logger from "../../common/logger";

function generateAuthToken(user){
    return jwt.sign({id: user.id}, process.env.JWT_KEY,
        {expiresIn: parseInt(process.env.JWT_LIFETIME), noTimestamp: true});
}


async function acquireToken(body) {
    const user = await User.findOne({where: {login: body.login}});
    if (!user) {
        logger.debug(`User ${body.login} not found in DB`);
        throw createError(403, "Invalid user or password")
    }
    logger.debug(`Processing user: ${user.login} (id: ${user.id})`);
    const match = await bcrypt.compare(body.password, user.password);
    if (!match) {
        logger.debug(`Passwords missmatch`);
        throw createError(403, "Invalid user or password");
    }
    const token = generateAuthToken(user);
    logger.info(`Creating token with lifetime ${process.env.JWT_LIFETIME} sec. for user ${user.login} (id: ${user.id})`);
    const expireDate = new Date();
    expireDate.setSeconds(expireDate.getSeconds() + process.env.JWT_LIFETIME);
    return {
        user_id: user.id,
        token: token,
        token_expire: expireDate.toString(),
    }
}

export default {
    acquireToken,
}