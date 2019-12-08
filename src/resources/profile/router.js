import express from 'express';
import service from './service';
const { handleErrorAsync } = require('../../common/utils');
import {checkJWT} from "../../common/auth";
import {throwMethodNotAllowed} from "../../common/utils";
import validateSchema from './validation/validation';

const router = express.Router();

const createNewProfile = async (request, response) => {
    const { body, user } = request;
    const info = {...body, currentUser: user.id};
    const resMsg = await service.createNewProfile(info);
    response.status(200).send(resMsg);
};

const getUserInfo = async (request, response) => {
  const { params } = request;
  const resMsg = await service.getUserPublicInfo(params);
  response.status(200).send(resMsg);
};

const updateUserInfo = async (request, response) => {
    const { params, user, body } = request;
    const userInfo = {...params, ...body, currentUser: user.id};
    const resMsg = await service.updateUserInfo(userInfo);
    response.status(200).send(resMsg);
};

const deleteUser = async (request, response) => {
    const { params, user } = request;
    const resMsg = await service.deleteUser({...params, currentUser: user.id});
    response.status(200).send(resMsg);
};

router.get("/:id", handleErrorAsync(getUserInfo));
router.put("/:id", checkJWT, validateSchema('change-profile'), handleErrorAsync(updateUserInfo));
router.delete("/:id", checkJWT, handleErrorAsync(deleteUser));
router.all("/:id", throwMethodNotAllowed(['GET', 'PUT', 'DELETE']));
router.post("/", checkJWT, validateSchema('new-profile'), handleErrorAsync(createNewProfile));
router.all("/", throwMethodNotAllowed(['POST']));



module.exports = router;