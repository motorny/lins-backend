import express from 'express';
import service from './service';
import { handleErrorAsync, throwMethodNotAllowed } from '../../common/utils'

import * as validationSchemas from './validation/validation';

const router = express.Router();

async function handlePostAddNewTag(request, response) {
    const {body} = request;
    const newItem = await service.addNewTag(body);
    response.status(201).send(newItem);
}


async function handleGetTagsAndStats(request, response) {
    const result = await service.getAllTags();
    response.send(result);
}

router.get("/", handleErrorAsync(handleGetTagsAndStats));
router.post("/", handleErrorAsync(handlePostAddNewTag));
router.all("/",throwMethodNotAllowed(['GET','POST']));

module.exports = router;