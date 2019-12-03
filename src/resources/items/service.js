import {Item, ItemStatus, User, Storage} from "../../database/models";
import createError from 'http-errors'
import {saveBase64ToImage, getMediaUrl} from "../../common/staticHandlers";
import logger from "../../common/logger";
import {composeOwnerObject} from "../profile/service";
import Sequelize from "sequelize";
import {error} from "winston";

async function userDefaultStorage(user) {
    // returns user's default(first) storage
    // creates one if it does not exists

    const storage = await Storage.findOne({where: {owner_id: user.id, primary: true}});

    if (storage) {
        logger.debug(`User ${user.login} already has primary storage`);
        return storage;
    }
    logger.info(`Creating primary storage for user ${user.login}`);
    return Storage.create({
        name: "My storage",
        primary: true,
        owner_id: user.id
    });
}

async function assignTags(item, tag_ids) {
    if (tag_ids) {
        logger.info(`Assiging tags ${tag_ids}`);
        await createdItem.setTags(tag_ids).catch((err) => {
            if (err instanceof Sequelize.ForeignKeyConstraintError) {
                logger.info(`Can add link to the tags with ids: ${tag_ids}. Some tag is not present in DB`);
                throw createError(409, `Tag ids are not valid`)
            } else {
                throw err;
            }
        });
    }
}


async function addNewItem(item, user) {
    if (item.image) {
        // relative path to the saved image is returned
        item.image = await saveBase64ToImage(item.image, 'items');
        logger.debug(`Image saved to media storage: ${item.image}`);
    }
    item.status = await ItemStatus.findOne({where: {status: 'free'}}).get('id');

    let storage;
    if (!item.storage_id) {
        storage = await userDefaultStorage(user);
        item.storage_id = storage.id;
    } else {
        // validate if it is his own storage
        storage = await Storage.findByPk(item.storage_id);
        if (!storage)
            throw createError(400, 'Invalid storage ID');
        if (!user.isAdmin &&
            storage.owner_id !== user.id) {
            // check the user is assigning to it's own storage
            // if he is not an admin
            logger.debug(`User ${user.login} does not own storage ${storage.id}`);
            throw createError(403, 'Permission denied');
        }
    }

    logger.info(`Creating item ${item.name} in the storage ${storage.name} (id: ${storage.id})`);
    const createdItem = await Item.create(item);

    await assignTags(createdItem, item.tag_ids);

    return {
        message: 'Success',
        id: createdItem.id
    };
}

const composeItemObjToSend = async (item) => {
    const storage = await item.getStorage({attributes: ['id', 'location', 'name', 'description', 'owner_id']});
    const tags = await item.getTags({attributes: ['id', 'tag']});

    let owner = null;
    let composedStorage = null;
    if (storage) {
        const user = await storage.getUser({attributes: ['id']});
        if (user) {
            owner = await composeOwnerObject(user.id)
        }
        composedStorage = {
            id: storage.id,
            location: storage.location,
            name: storage.name,
            description: storage.description
        };
    }

    return {
        id: item.id,
        name: item.name,
        description: item.description,
        image_url: getMediaUrl(item.image),
        status: item.status,
        storage: composedStorage,
        owner: owner,
        tags: Array.from(tags, (tag) => {
            return {id: tag.id, tag: tag.tag}
        })
    }

};


async function getItems() {
    return Item.findAll().then(async (items) => {
        let itemsList = [];
        logger.debug(`Got ${items.length} items`);
        if (items) {
            itemsList = await Promise.all(Array.from(items, composeItemObjToSend));
        }
        return {
            page: 1,
            totalCnt: itemsList.length,
            items: itemsList
        };
    });
}

async function getItemById(itemID) {
    const item = await Item.findByPk(itemID);
    if (!item) {
        logger.debug(`Item with id ${itemID} not found`);
        throw createError(412, 'Item not found');
    }
    return composeItemObjToSend(item);
}

async function changeItemById(itemID, body, user) {
    const item = await Item.findByPk(itemID);
    if (!item) {
        logger.debug(`Item with id ${itemID} not found`);
        throw createError(412, 'Item not found');
    }

    const storage = await item.getStorage();
    if (!storage) {
        logger.error(`Item ${item.id}  is not assigned to any storage`);
        throw createError(500, 'Data inconsistency');
    }


    if (!user.isAdmin && storage.owner_id !== user.id) {
        logger.debug(`Item ${item.name} (id: ${item.id}) is not owned by non-admin ${user.login}`);
        throw createError(403, 'Permission denied');
    }

    if (body.storage_id) {
        const storage = await Storage.findByPk(item.storage_id);
        if (!storage) {
            logger.debug(`Storage with id ${body.storage_id} not found`);
            throw createError(400, 'Invalid storage ID');
        }
        if (!user.isAdmin &&
            storage.owner_id !== user.id) {
            // check the user is assigning to it's own storage
            // if he is not an admin
            logger.debug(`Storage ${storage.name} (id: ${storage.id}) is not owned by non-admin ${user.login}`);
            throw createError(403, 'Permission denied');
        }
    }

    if (body.image) {
        // relative path to the saved image is returned
        body.image = await saveBase64ToImage(body.image, 'items');
        logger.debug(`Image saved to media storage: ${item.image}`);
    }

    logger.info(`Updating item ${item.name} (id: ${item.id}) with values ${body}`);
    await item.update(body, {fields: ['name', 'description', 'image', 'storage_id']});

    await assignTags(item, body.tag_ids);

    return composeItemObjToSend(item);
}

async function deleteItemById(itemID, user) {
    const item = await Item.findByPk(itemID);
    if (!item) {
        logger.debug(`Item with id ${itemID} not found`);
        throw createError(412, 'Item not found');
    }

    const storage = await item.getStorage({attributes: ['owner_id']});
    if (!storage) {
        logger.error(`Item ${item.id}  is not assigned to any storage`);
        throw createError(500, 'Data inconsistency');
    }

    if (!user.isAdmin &&
        storage.owner_id !== user.id) {
        // Can not delete not owned item, if not Admin
        logger.debug(`Item ${item.name} (id: ${item.id}) is not owned by non-admin ${user.login}`);
        throw createError(403, 'Permission denied');
    }

    return item.destroy().then(() => {
        logger.info(`Item (id: ${itemID}) successfully deleted!`);
        return {
            message: `Success`
        }
    });
}


export default {
    addNewItem,
    getItems,
    getItemById,
    changeItemById,
    deleteItemById
}