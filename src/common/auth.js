import jwt from 'jsonwebtoken';
import {User} from '../database/models'
import logger from "./logger";

async function getTokenFromRequest(req) {
    try {
        const tokenHeader = req.header('Authorization');
        if (!tokenHeader) {
            throw Error('No Authorization header present');
        }

        const token = tokenHeader.replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findOne({where: {id: data.id}});
        if (!user) {
            throw Error('User not found in DB');
        }
    } catch (error) {
        logger.debug(error);
        return undefined;
    }
    return {
        user: user,
        tokenData: data
    };
}


export const checkJWT = async (req, res, next) => {
    const tokenObj = await getTokenFromRequest(req);
    if (!tokenObj) {
        res.status(403).send({message: 'Not authorized'});
    } else {
        req.user = tokenObj.user;
        req.tokenData = tokenObj.data;
        next()
    }
};

export const checkJWTAdmin = async (req, res, next) => {
    const tokenObj = await getTokenFromRequest(req);
    if (!tokenObj) {
        res.status(403).send({message: 'Not authorized'});
    } else if (!tokenObj.user.isAdmin) {
        res.status(403).send({message: 'Permission denied'});
    } else {
        logger.info(`Admin ${tokenObj.user.login} is accessing protected endpoint`);
        req.user = tokenObj.user;
        req.tokenData = tokenObj.data;
        next()
    }
};