import express from 'express';
import service from './service';
import { handleErrorAsync, throwMethodNotAllowed } from '../../common/utils'

const router = express.Router();

async function handlePostAcquireToken(request, response) {
    const fromURLencoded = request.body;
    const tokenResponse = await service.acquireToken(fromURLencoded);
    response.status(200).send(tokenResponse);
}

// async function handleGetTokenInfo(request, response) {
//     const {body} = request;
//     const newItem = await service.addNewUser(body);
//     response.status(201).send(newItem);
// }



//router.get("/", handleErrorAsync(handleGetTokenInfo));
router.post("/", handleErrorAsync(handlePostAcquireToken));
router.all("/",throwMethodNotAllowed(['GET','POST']));

module.exports = router;