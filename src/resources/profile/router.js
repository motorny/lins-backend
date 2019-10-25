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

const getUserInfo = async (request, response) => {
  const { query } = request;
  await validate(query, validationSchemas.getUserInfoValidationSchema);
  const resMsg = await service.getUserPublicInfo(query);
  response.status(200).send(resMsg);
};

router.get("/", handleErrorAsync(getUserInfo));
router.post("/newuser", handleErrorAsync(registerNewUser));



module.exports = router;