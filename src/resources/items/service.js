import {Item, ItemStatus, Storage } from "../../database/models";
import createError from 'http-errors'
import {saveBase64ToImage} from "../../common/staticHandlers";
import logger from "../../common/logger";
import Sequelize from "sequelize";
import {composeItemObjToSendFull, composeItemObjToSendMinified} from "./mapper";
import {getItemByIdFromDb, getAllItemsFromDb, countAllItems} from "./queries";
import {composeURL, ITEMS_E_N} from "../../common/endpointNames";
import urljoin from 'url-join';

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
        await item.setTags(tag_ids).catch((err) => {
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
        id: createdItem.id,
        _links: {_self: composeURL(urljoin(ITEMS_E_N, createdItem.id.toString()))}
    };
}

async function getItems(filter, offset, limit) {
    const filteredCount = await countAllItems(filter);
    logger.debug(`Count of items, that matches filter: ${filteredCount}`);
    return getAllItemsFromDb(filter, offset, limit).then((items) => {
        let itemsList = [];
        logger.debug(`Got ${items.length} items`);
        if (items) {
            itemsList = Array.from(items, composeItemObjToSendMinified);
        }
        return {
            totalCnt: filteredCount,
            items: itemsList
        };
    });
}

async function getItemById(itemID) {
    const item = await getItemByIdFromDb(itemID);
    if (!item) {
        logger.debug(`Item with id ${itemID} not found`);
        throw createError(412, 'Item not found');
    }
    return composeItemObjToSendFull(item);
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
    if (body.status){
        body.status = await ItemStatus.findOne({where: {status: body.status}}).get('id');
    }
    logger.info(`Updating item ${item.name} (id: ${item.id}) with values ${body}`);
    await item.update(body, {fields: ['name', 'description', 'image', 'storage_id', 'status']});

    await assignTags(item, body.tag_ids);
    const updatedItem = await getItemByIdFromDb(item.id);
    if(!updatedItem) {
        throw createError(500, "Update failed");
    }
    return composeItemObjToSendFull(updatedItem);
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