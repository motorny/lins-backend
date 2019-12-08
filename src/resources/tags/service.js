import {Tag} from "../../database/models";
import logger from "../../common/logger";
import createError from 'http-errors'
import Sequelize from "sequelize";

async function addNewTag(tagData) {
    return Tag.create(tagData).catch((err) => {
        if (err instanceof Sequelize.UniqueConstraintError) {
            logger.info(`Tag ${tagData.tag} already exists`);
            throw createError(409, `Already exists`)
        } else {
            throw err;
        }
    }).then((createdTag) => {
        logger.info(`Created new tag ${createdTag.tag} (id: ${createdTag.id})`);
        return {
            message: 'Success',
            id: createdTag.id,
            tag: createdTag.tag
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
        logger.debug(`Got ${tags.length} tags from DB`);
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