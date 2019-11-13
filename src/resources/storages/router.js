import express from 'express';
import service from './service';
import message from '../../common/constants.js';
import { handleErrorAsync, throwMethodNotAllowed } from '../../common/utils'
import createError from 'http-errors'

const router = express.Router();


async function addNewStorage(request, response) {
    // validate(body);
    const {body} = request;
    const newStorage = await service.addNewStorage(body);
    response.status(201).send(newStorage);
}

async function getOneStorage(request, response) {
    const id = parseInt(request.params.id);
    const storage = await service.getOneStorage(id);
    if(!storage)
    {
        throw createError(404, message.NO_SUCH_STORAGE);
    }
    response.send(storage);
}

router.post("/", handleErrorAsync(addNewStorage));
router.get("/:id", handleErrorAsync(getOneStorage));
router.all("/",throwMethodNotAllowed(['GET','POST']));

module.exports = router;