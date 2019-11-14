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
async function handleGetComments(request, response) {
    const result = await service.getComments();
    response.status(200).send(result);
}
async function handleDeleteCommentById(request, response) {
    const id = parseInt(request.params.id);
    const comment = await service.deleteCommentById(id);
    response.status(200).send(comment);
}
async function handleGetCommentsByItemId(request, response) {
    const item_id = parseInt(request.params.item_id);
    const result = await service.getCommentsByItemId(item_id);
    response.status(200).send(result);
}
async function handleChangeCommentById(request, response) {
    const id = parseInt(request.params.id);
    const {body} = request;
    const changedComment = await service.changeCommentById(id, body);
    response.status(200).send(changedComment);
}

router.post("/", handleErrorAsync(handlePostAddNewComment));
router.get("/", handleErrorAsync(handleGetComments));
router.delete("/:id", handleErrorAsync(handleDeleteCommentById));
router.put("/:id", handleErrorAsync(handleChangeCommentById));
router.get("/:item_id", handleErrorAsync(handleGetCommentsByItemId));
router.all("/",throwMethodNotAllowed(['GET', 'POST']));
router.all("/:id",throwMethodNotAllowed(['DELETE', 'PUT']));
router.all("/:item_id",throwMethodNotAllowed(['GET']));

module.exports = router;