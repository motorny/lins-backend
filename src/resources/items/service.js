import {Item, ItemStatus, User, Storage} from "../../database/models";
import createError from 'http-errors'
import {saveBase64ToImage, getMediaUrl} from "../../common/staticHandlers";
import logger from "../../common/logger";

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
            createError(400, 'Invalid storage ID');
        if (!user.isAdmin &&
            storage.owner_id !== user.id) {
            // check the user is assigning to it's own storage
            // if he is not an admin
            createError(403, 'Permission denied');
        }
    }
    const createdItem = await Item.create(item);
    logger.info(`Creating item ${item.name} in the storage ${storage.name} (id: ${storage.id})`);
    if (item.tag_ids) {
        logger.info(`Assiging tags ${item.tag_ids}`);
        await createdItem.setTags(item.tag_ids)
    }

    return {
        message: 'Success',
        id: createdItem.id
    };
}

const composeItemObjToSend = async (item) => {
    // later it will be populated with requests to storage, status user and tags tables
    const storage = await item.getStorage({attributes: ['id', 'location', 'name', 'description']});
    const tags = await item.getTags({attributes: ['id', 'tag']});

    let user = null;
    if (storage) {
        user = await storage.getUser({attributes: ['id', 'login']});
    }
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        image_url: getMediaUrl(item.image),
        status: item.status,
        storage: storage,
        user: user,
        tags: Array.from(tags, (tag) => {
            return {id: tag.id, tag: tag.tag}
        })
    }

};


async function getItems() {
    return Item.findAll().then(async (items) => {
        let itemsList = [];
        logger.debug(`Got ${itemsList.length} items`);
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
    if (!user.isAdmin && storage.owner_id !== user.id) {
        logger.debug(`Item ${item.name} (id: ${item.id}) is not owned by non-admin ${user.login}`);
        throw createError(403, 'Permission denied');
    }

    if (body.storage_id) {
        const storage = await Storage.findByPk(item.storage_id);
        if (!storage) {
            logger.debug(`Storage with id ${body.storage_id} not found`);
            createError(400, 'Invalid storage ID');
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

    if (body.tag_ids) {
        logger.info(`Assiging tags ${body.tag_ids}`);
        await item.setTags(body.tag_ids);
    }

    return composeItemObjToSend(item);
}

async function deleteItemById(itemID, user) {
    const item = await Item.findByPk(itemID);
    if (!item) {
        logger.debug(`Item with id ${itemID} not found`);
        throw createError(412, 'Item not found');
    }

    const storage = await item.getStorage({attributes: ['owner_id']});
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