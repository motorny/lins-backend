import express from 'express';
import service from './service';
import message from '../../common/constants.js';
import { handleErrorAsync, throwMethodNotAllowed } from '../../common/utils'
import validateSchema from './validation';
import createError from 'http-errors'
import {checkJWT, checkJWTAdmin} from "../../common/auth";

const router = express.Router();


async function addNewStorage(request, response) {
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
    if(!owner_id) {
        throw createError(400, "Invalid query parameters");
    }
    const storage = await service.getAllOwnerStorage(owner_id);
    if(!storage)
    {
        throw createError(404, message.NO_SUCH_STORAGE);
    }
    response.send(storage);
}

async function changeStorageById(request, response) {
    const id = parseInt(request.params.id);
    const changedStorage = await service.changeStorageById(id, request.body, request.user);
    response.send(changedStorage);
}

async function deleteStorageById(request, response) {
    const id = parseInt(request.params.id);
    const {body} = request;
    const deletedStorage = await service.deleteStorageById(id, body);
    response.send(deletedStorage);
}

router.get("/:id", handleErrorAsync(getOneStorage));
router.put("/:id", checkJWT, validateSchema('change-storage'), handleErrorAsync(changeStorageById));
router.delete("/:id", checkJWTAdmin, handleErrorAsync(deleteStorageById));
router.all("/:id",throwMethodNotAllowed(['GET','PUT', 'DELETE']));
router.get("/", handleErrorAsync(getAllOwnerStorage));
router.post("/", checkJWTAdmin, validateSchema('new-storage'), handleErrorAsync(addNewStorage));
router.all("/",throwMethodNotAllowed(['GET','POST']));

module.exports = router;