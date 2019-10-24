import express from 'express';
import service from './service';
import Joi from 'joi';
import * as validationSchemas from './validation/validation';
import { promisify } from 'es6-promisify';
const { handleErrorAsync } = require('../../common/utils');


const router = express.Router();
const validate = promisify(Joi.validate).bind(Joi);

const registerNewUser = async (request, response) => {
    const { body } = request;
    await validate(body, validationSchemas.registerNewUserValidationSchema);
    const resMsg = await service.registerNewUser(body);
    response.status(200).send(resMsg);
};

router.post("/newuser", handleErrorAsync(registerNewUser));


router.get("/", (request, response) => {
    service.getAllUsers().then( (result) => {
        response.send(JSON.stringify(result));
    });
});

module.exports = router;