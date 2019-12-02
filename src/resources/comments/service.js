import {Comment, Item} from "../../database/models";
import createError from "http-errors";
import {saveBase64ToImage} from "../../common/staticHandlers";
import {where} from "sequelize";
//import * as Error from "../../common/constants";

async function addNewComment(comment) {
    //TODO: add verification whether comment.user_id landed this thing
    const item = await Item.findByPk(comment.item_id);
    if (!item){
        throw createError(400, 'No such item');
    }
    console.log(item);
    if (comment.image){
        comment.image = await saveBase64ToImage(comment.image, 'comments');
    }
    const createdComment = await Comment.create(comment);
    return {
        message: 'Success',
        id: createdComment.id
    }
}

async function getCommentsByItemId(query) {
    const allComments = await Comment.findAll({where: {item_id: query}})
}

async function deleteCommentById(itemID) {
    const comment = await Comment.findByPk(itemID);
    if (!comment) {
        throw createError(412, 'Comment not found');
    }

    return comment.destroy().then(() => {
        return {
            message: `Comment (id: ${itemID}) successfully deleted!`
        }
    });
}
async function changeCommentById(itemID, body) {
    const comment = await Comment.findByPk(itemID);
    if (!comment) {
        throw createError(412, 'Comment not found');
    }

    return comment.update(body, {fields: ['comment', 'title', 'image_url']});
}

export default {
    addNewComment,
    getCommentsByItemId,
    deleteCommentById,
    changeCommentById
}