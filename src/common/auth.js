import jwt from 'jsonwebtoken';
import {User} from '../database/models'
import createError from 'http-errors'

export const checkJWT = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findOne({where: {id: data.id}});
        if(!user) {
            throw Error();
        }
        req.user = user;
        req.tokenData = data;
        next()
    } catch (error) {
        console.log(error);
        res.status(403).send({message: 'Not Authorized'});
    }
};

export const checkJWTAdmin = async (req, res, next) => {
    let user;
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);

        user = await User.findOne({where: {id: data.id}});
        if(!user || !user.isAdmin) {
            throw Error();
        }
        console.log(user.isAdmin);
        req.user = user;
        req.tokenData = data;
        next()
    } catch (error) {
        console.log(error);
        if(!user) {
            res.status(403).send({message: 'Not authorized'});
        }
        else{
            res.status(403).send({message: 'You are not admin'});
        }
    }
};