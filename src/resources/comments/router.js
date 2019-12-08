import express from 'express';
import service from './service';
import { handleErrorAsync, throwMethodNotAllowed } from '../../common/utils'
// import {checkJWT} from "../../common/auth";

import validateSchema from './validation/validation';

const router = express.Router();

async function handlePostAddNewComment(request, response) {
    //TODO: get user from current session, not body
    const {body} = request;
    const newComment = await service.addNewComment(body);
    response.status(201).send(newComment);
}

async function handleGetCommentsByItemId(request, response) {
    const item_id = parseInt(request.params.item_id);
    const result = await service.getCommentsByItemId(item_id);
    response.send(result);
}

async function handleDeleteCommentById(request, response) {
    const id = parseInt(request.params.id);
    const comment = await service.deleteCommentById(id, request.user);
    //const comment = await service.deleteCommentById(id, 3);
    response.send(comment);
}

async function handleChangeCommentById(request, response) {
    const id = parseInt(request.params.id);
    const {body} = request;
    const changedComment = await service.changeCommentById(id, body);
    response.send(changedComment);
}

// router.post("/", checkJWT, validateSchema('new-comment'), handleErrorAsync(handlePostAddNewComment));
router.post("/", validateSchema('new-comment'), handleErrorAsync(handlePostAddNewComment));
router.get("/:item_id", handleErrorAsync(handleGetCommentsByItemId));
router.delete("/:id", handleErrorAsync(handleDeleteCommentById));
router.put("/:id", validateSchema('change-comment'), handleErrorAsync(handleChangeCommentById));

router.all("/",throwMethodNotAllowed(['POST']));
router.all("/:id",throwMethodNotAllowed(['DELETE', 'PUT']));
router.all("/:item_id",throwMethodNotAllowed(['GET']));

export default router;