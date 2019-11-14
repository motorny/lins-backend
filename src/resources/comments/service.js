import {Comment, Item} from "../../database/models";
import createError from "http-errors";
import {saveBase64ToImage} from "../../common/staticHandlers";
//import * as Error from "../../common/constants";

async function addNewComment(comment) {
    //console.log(comment);
    return Comment.create(comment);
}

async function getComments() {
    //console.log("Doing getComments")
    return Comment.findAll();
}

async function getCommentsByItemId(query) {
    let retObj;
    //console.log("Doing getCommentsByItemId")
    await Comment.findByPk(query.item_id).then( (comment) => {
        if(!comment) {
            retObj = null;
        } else {
            const values = user.dataValues;
            retObj = {
                user: values.user_id,
                comment: values.comment,
                title: values.title,
                image_url: values.image_url,
            };
        }
    });
    return retObj;
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
    getComments,
    deleteCommentById,
    changeCommentById
}