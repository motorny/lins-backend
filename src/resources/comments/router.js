import express from 'express';
import service from './service';
import message from '../../common/constants.js';
import { handleErrorAsync, throwMethodNotAllowed } from '../../common/utils'
import createError from 'http-errors'

const router = express.Router();


async function handlePostAddNewComment(request, response) {
    const {body} = request;
    const newComment = await service.addNewComment(body);
    response.status(201).send(newComment);
}

router.post("/", handleErrorAsync(handlePostAddNewComment));
router.all("/",throwMethodNotAllowed(['POST']));

module.exports = router;