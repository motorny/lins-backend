import express from 'express';
import service from './service';
import { handleErrorAsync, throwMethodNotAllowed } from '../../common/utils'

import * as validationSchemas from './validation/validation';

const router = express.Router();

async function handlePostAddNewUser(request, response) {
    const {body} = request;
    const newItem = await service.addNewUser(body);
    response.status(201).send(newItem);
}


async function handleGetUserById(request, response) {
    const id = parseInt(request.params.id);
    const result = await service.getUserById(id);
    response.send(result);
}

router.get("/:id", handleErrorAsync(handleGetUserById));
router.all("/:id",throwMethodNotAllowed(['GET']));
router.post("/", handleErrorAsync(handlePostAddNewUser));
router.all("/",throwMethodNotAllowed(['GET','POST']));

module.exports = router;