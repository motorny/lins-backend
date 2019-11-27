import {Item, Tag} from "../../database/models";
import createError from 'http-errors'

async function addNewTag(tag) {
    return Tag.create(tag).then((createdTag) => {
        return {
            message: 'Success',
            id: createdTag.id
        };
    });
}

const getLinkedCount = async (tag) => {
    const linked_cnt = await tag.countItems();

    return {
        id: tag.id,
        tag: tag.tag,
        itemsCnt: linked_cnt
    }
};

async function getAllTags() {
    return Tag.findAll().then(async (tags) => {
        const tagsList = await Promise.all(Array.from(tags, getLinkedCount));
        return {
            totalCnt: tags.length,
            items: tagsList
        };
    });
}

export default {
    addNewTag,
    getAllTags,
}