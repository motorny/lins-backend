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

async function getAllOwnerStorage(request, response) {
    const owner_id = parseInt(request.query.owner_id);
    const storage = await service.getAllOwnerStorage(owner_id);
    if(!storage)
    {
        throw createError(404, message.NO_SUCH_STORAGE);
    }
    response.send(storage);
}

async function changeStorageById(request, response) {
    const id = parseInt(request.params.id);
    const changedStorage = await service.changeStorageById(id);
    response.send(changedStorage);
}

async function deleteStorageById(request, response) {
    const id = parseInt(request.params.id);
    const {body} = request;
    const deletedStorage = await service.deleteStorageById(id, body);
    response.send(deletedStorage);
}

router.post("/", handleErrorAsync(addNewStorage));
router.get("/:id", handleErrorAsync(getOneStorage));
router.get("/", handleErrorAsync(getAllOwnerStorage));
router.all("/",throwMethodNotAllowed(['GET','POST']));
router.put("/:id", handleErrorAsync(changeStorageById));
router.delete("/:id", handleErrorAsync(deleteStorageById));

module.exports = router;