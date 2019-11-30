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