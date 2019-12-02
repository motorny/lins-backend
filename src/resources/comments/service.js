import {Comment, Item, User} from "../../database/models";
import createError from "http-errors";
import {saveBase64ToImage} from "../../common/staticHandlers";
//import {where} from "sequelize";
import logger from "../../common/logger";
//import * as Error from "../../common/constants";

async function addNewComment(comment) {
    //TODO: add verification whether comment.user_id lent this thing
    const user = await User.findByPk(comment.user_id);
    if (!user){
        throw createError(400, 'No such user');
    }

    const item = await Item.findByPk(comment.item_id);
    if (!item){
        throw createError(400, 'No such item');
    }

    if (comment.image){
        comment.image = await saveBase64ToImage(comment.image, 'comments');
        logger.debug(`Image saved to media storage: ${comment.image}`);
    }

    const createdComment = await Comment.create(comment);
    return {
        message: 'Success',
        id: createdComment.id
    }
}

async function getCommentsByItemId(itemID) {
    //TODO: pretty raw, but works (returns raw array of comments)
    const allComments = await Comment.findAll({where: {item_id: itemID}});
    if (allComments.length === 0){
        logger.debug(`Item with id ${itemID} not found`);
        throw createError(412, 'Item not found');
    }
    return {
        message: 'Success',
        comments: allComments
    }
}

async function deleteCommentById(commentID, user) {
    const comment = await Comment.findByPk(commentID);
    if (!comment) {
        logger.debug(`Comment with id ${commentID} not found`);
        throw createError(412, 'Comment not found');
    }

    if (comment.user_id !== user){
        logger.debug(`This comment was not added by this user:${user}`);
        throw createError(403, 'Permission denied');
    }

    return comment.destroy().then(() => {
        logger.info(`Comment (id: ${commentID}) successfully deleted!`);
        return {
            message: `Success`
        }
    });
}

async function changeCommentById(commentID, body) {
    const comment = await Comment.findByPk(commentID);
    if (!comment) {
        logger.debug(`Comment with id ${commentID} not found`);
        throw createError(412, 'Comment not found');
    }
    if (comment.user_id !== body.user_id) {
        logger.debug(`Comment is not owned by ${body.user_id}`);
        throw createError(403, 'Permission denied');
    }
    if (comment.item_id !== body.item_id){
        logger.debug(`This comment should belong to ${comment.item_id} but you try to assign to ${body.item_id}`);
        throw createError(403, 'Permission denied');
    }
    if (body.image) {
        // relative path to the saved image is returned
        body.image = await saveBase64ToImage(body.image, 'comments');
        logger.debug(`Image saved to media storage: ${comment.image}`);
    }
    return await comment.update(body, {fields: ['comment', 'title', 'image_url']});
}

export default {
    addNewComment,
    getCommentsByItemId,
    deleteCommentById,
    changeCommentById
}