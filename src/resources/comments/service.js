import {Comment, Item} from "../../database/models";
import createError from "http-errors";
import {saveBase64ToImage} from "../../common/staticHandlers";
//import {where} from "sequelize";
import logger from "../../common/logger";
//import * as Error from "../../common/constants";

async function addNewComment(comment, user) {
    const item = await Item.findByPk(comment.item_id);
    if (!item){
        throw createError(400, 'No such item');
    }

    if (comment.image){
        comment.image = await saveBase64ToImage(comment.image, 'comments');
        logger.debug(`Image saved to media storage: ${comment.image}`);
    }
    comment.user_id = user.id;
    const createdComment = await Comment.create(comment);
    return {
        message: 'Success',
        id: createdComment.id
    }
}

async function getCommentsByItemId(itemID) {
    const allComments = await Comment.findAll({where: {item_id: itemID}});
    if (allComments.length === 0){
        logger.debug(`Item with id ${itemID} not found`);
        throw createError(412, 'Item not found');
    }
    return {
        count: allComments.length,
        comments: allComments
    }
}

async function deleteCommentById(commentID, user) {
    const comment = await Comment.findByPk(commentID);
    if (!comment) {
        logger.debug(`Comment with id ${commentID} not found`);
        throw createError(412, 'Comment not found');
    }

    if (comment.user_id !== user.id){
        logger.debug(`This comment was not added by this user:${user.id}`);
        throw createError(403, 'Permission denied');
    }

    return comment.destroy().then(() => {
        logger.info(`Comment (id: ${commentID}) successfully deleted!`);
        return {
            message: `Success`
        }
    });
}

async function changeCommentById(commentID, body, user) {
    const comment = await Comment.findByPk(commentID);

    if (!comment) {
        logger.debug(`Comment with id ${commentID} not found`);
        throw createError(412, 'Comment not found');
    }
    if (comment.user_id !== user.id) {
        logger.debug(`Comment is not owned by ${user.id}`);
        throw createError(403, 'Permission denied');
    }
    if (body.image) {
        body.image = await saveBase64ToImage(body.image, 'comments');
        logger.debug(`Image saved to media storage: ${comment.image}`);
    }
    return await comment.update(body, {fields: ['comment', 'title', 'image']});
}

export default {
    addNewComment,
    getCommentsByItemId,
    deleteCommentById,
    changeCommentById
}