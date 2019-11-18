import {User} from "../../database/models";
import createError from 'http-errors';

import jwt from 'jsonwebtoken'

const bcrypt = require('bcrypt');

function generateAuthToken(user){
    return jwt.sign({id: user.id}, process.env.JWT_KEY,
        {expiresIn: parseInt(process.env.JWT_LIFETIME), noTimestamp: true});
}


async function acquireToken(fromURLencoded) {
    const user = await User.findOne({where: {login: fromURLencoded.login}});
    if (!user) {
        throw createError(403, "Invalid user or password")
    }
    const match = await bcrypt.compare(fromURLencoded.password, user.password);
    if (!match) {
        throw createError(403, "Invalid user or password");
    }

    return {
        user_id: user.id,
        token: generateAuthToken(user)
    }
}

export default {
    acquireToken,
}