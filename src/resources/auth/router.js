import express from 'express';
import service from './service';
import {handleErrorAsync, throwMethodNotAllowed} from '../../common/utils';
import {checkJWT} from "../../common/auth";

const router = express.Router();

async function handlePostAcquireToken(request, response) {
    const fromURLencoded = request.body;
    const tokenResponse = await service.acquireToken(fromURLencoded);
    response.status(200).send(tokenResponse);
}

async function handleGetTokenInfo(request, response) {
    response.status(200).send(request.tokenData);
}


router.get("/", checkJWT, handleErrorAsync(handleGetTokenInfo));
router.post("/", handleErrorAsync(handlePostAcquireToken));
router.all("/", throwMethodNotAllowed(['GET', 'POST']));

module.exports = router;