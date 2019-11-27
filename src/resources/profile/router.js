import express from 'express';
import service from './service';
import Joi from 'joi';
import * as validationSchemas from './validation/validation';
import { promisify } from 'es6-promisify';
const { handleErrorAsync } = require('../../common/utils');
import {checkJWT} from "../../common/auth";
import {throwMethodNotAllowed} from "../../common/utils";
import validateSchema from './validation/validation';

const router = express.Router();

const registerNewUser = async (request, response) => {
    const { body } = request;
    const resMsg = await service.registerNewUser(body);
    response.status(200).send(resMsg);
};

const getUserInfo = async (request, response) => {
  const { params } = request;
  const resMsg = await service.getUserPublicInfo(params);
  response.status(200).send(resMsg);
};

const updateUserInfo = async (request, response) => {
    const { params, body } = request;
    const userInfo = {...params, ...body};
    const resMsg = await service.updateUserInfo(userInfo);
    response.status(200).send(resMsg);
};

const deleteUser = async (request, response) => {
    const { params } = request;
    const resMsg = await service.deleteUser(params);
    response.status(200).send(resMsg);
};

router.get("/:id", handleErrorAsync(getUserInfo));
router.put("/:id", checkJWT, validateSchema('change-profile'), handleErrorAsync(updateUserInfo));
router.delete("/:id", checkJWT, handleErrorAsync(deleteUser));
router.all("/:id", throwMethodNotAllowed(['GET', 'PUT', 'DELETE']));
router.post("/", checkJWT, validateSchema('new-profile'), handleErrorAsync(registerNewUser));
router.all("/", throwMethodNotAllowed(['GET', 'POST']));



module.exports = router;