import {Comment} from "../../database/models";

async function addNewComment(comment) {
    //console.log(comment);
    return Comment.create(comment);
}

export default {
    addNewComment,
}