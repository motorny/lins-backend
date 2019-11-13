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
  const { params } = request;
  await validate(params, validationSchemas.getUserInfoValidationSchema);
  const resMsg = await service.getUserPublicInfo(params);
  response.status(200).send(resMsg);
};

const updateUserInfo = async (request, response) => {
    const { params, body } = request;
    const userInfo = {...params, ...body};
    await validate(userInfo, validationSchemas.updateUserInfoValidationSchema);
    const resMsg = await service.updateUserInfo(userInfo);
    response.status(200).send(resMsg);
};

const deleteUser = async (request, response) => {
    const { params } = request;
    await validate(params, validationSchemas.deleteUserValidationSchema);
    const resMsg = await service.deleteUser(params);
    response.status(200).send(resMsg);
};

router.get("/:id", handleErrorAsync(getUserInfo));
router.post("/", handleErrorAsync(registerNewUser));
router.put("/:id", handleErrorAsync(updateUserInfo));
router.delete("/:id", handleErrorAsync(deleteUser));




module.exports = router;