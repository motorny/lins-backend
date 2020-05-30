import express from 'express';
import service from './service';
import { handleErrorAsync, throwMethodNotAllowed } from '../../common/utils'
import {checkJWT} from "../../common/auth";

import validateSchema from './validation/validation';
import logger from "../../common/logger";

const router = express.Router();

async function handlePostAddNewComment(request, response) {
    const {body} = request;
    const newComment = await service.addNewComment(body, request.user);
    response.status(201).send(newComment);
}

async function handleGetCommentsByItemId(request, response) {
    const item_id = parseInt(request.params.id);
    logger.debug(`${item_id}`);
    const comments = await service.getCommentsByItemId(item_id);
    response.send(comments);
}

async function handleDeleteCommentById(request, response) {
    const id = parseInt(request.params.id);
    const comment = await service.deleteCommentById(id, request.user);
    response.send(comment);
}

async function handleChangeCommentById(request, response) {
    const id = parseInt(request.params.id);
    const {body} = request;
    const changedComment = await service.changeCommentById(id, body, request.user);
    response.send(changedComment);
}

// router.post("/", checkJWT, validateSchema('new-comment'), handleErrorAsync(handlePostAddNewComment));
router.get("/:id", handleErrorAsync(handleGetCommentsByItemId));
router.put("/:id", checkJWT, validateSchema('change-comment'), handleErrorAsync(handleChangeCommentById));
router.delete("/:id", checkJWT, handleErrorAsync(handleDeleteCommentById));
router.post("/", checkJWT, validateSchema('new-comment'), handleErrorAsync(handlePostAddNewComment));

router.all("/",throwMethodNotAllowed(['POST']));
router.all("/:id",throwMethodNotAllowed(['DELETE', 'PUT', 'GET']));

export default router;