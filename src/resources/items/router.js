import express from 'express';
import service from './service';
import {handleErrorAsync, throwMethodNotAllowed} from '../../common/utils'
import {checkJWT} from "../../common/auth";

import validateSchema from './validation';

const router = express.Router();

async function handlePostAddNewItem(request, response) {
    const {body} = request;
    const newItem = await service.addNewItem(body, request.user);
    response.status(201).send(newItem);
}

async function handleGetItems(request, response) {
    const filter = request.query.filter;
    const offset = Math.max(parseInt(request.query.offset) || 0, 0);
    // by default, send 10 items
    // send one item if negative value passed
    const limit = Math.max(parseInt(request.query.limit) || 10, 1);

    const items = await service.getItems(filter, offset, limit);
    response.send(items);
}


async function handleGetItemById(request, response) {
    const id = parseInt(request.params.id);
    const result = await service.getItemById(id);
    response.send(result);
}

async function handleDeleteItemById(request, response) {
    const id = parseInt(request.params.id);
    const item = await service.deleteItemById(id, request.user);
    response.send(item);
}

async function handleChangeItemById(request, response) {
    const id = parseInt(request.params.id);
    const {body} = request;
    const changedItem = await service.changeItemById(id, body, request.user);
    response.send(changedItem);
}


router.get("/:id", handleErrorAsync(handleGetItemById));
router.put("/:id", checkJWT, validateSchema('change-item'), handleErrorAsync(handleChangeItemById));
router.delete("/:id", checkJWT, handleErrorAsync(handleDeleteItemById));
router.all("/:id", throwMethodNotAllowed(['GET', 'PUT', 'DELETE']));
router.post("/", checkJWT, validateSchema('new-item'), handleErrorAsync(handlePostAddNewItem));
router.get("/", handleErrorAsync(handleGetItems));
router.all("/", throwMethodNotAllowed(['GET', 'POST']));

module.exports = router;