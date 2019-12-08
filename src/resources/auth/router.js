import express from 'express';
import service from './service';
import {handleErrorAsync, throwMethodNotAllowed} from '../../common/utils';
import {checkJWT} from "../../common/auth";
import validateSchema from "./validation";

const router = express.Router();

async function handlePostAcquireToken(request, response) {
    const {body} = request;
    const tokenResponse = await service.acquireToken(body);
    response.status(200).send(tokenResponse);
}

async function handleGetTokenInfo(request, response) {
    response.status(200).send({
        ...request.tokenData,
        isAdmin: request.user.isAdmin,
    });
}


router.get("/", checkJWT, handleErrorAsync(handleGetTokenInfo));
router.post("/", validateSchema('acquire-token'), handleErrorAsync(handlePostAcquireToken));
router.all("/", throwMethodNotAllowed(['GET', 'POST']));

module.exports = router;