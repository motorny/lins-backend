import {Item, ItemStatus, User, Storage} from "../../database/models";
import createError from 'http-errors'
import {saveBase64ToImage} from "../../common/staticHandlers";

async function addNewItem(item) {
    if (item.image) {
        // relative path to the saved image is returned
        item.image = await saveBase64ToImage(item.image, 'items');
    }
    item.status = await ItemStatus.findOne({where: {status: 'free'}}).get('id');


    const createdItem = await Item.create(item);

    if (item.tag_ids) {
        await createdItem.setTags(item.tag_ids)
    }

    return {
        message: 'Success',
        id: createdItem.id
    };
}

const composeItemObjToSend = async (item) => {
    // later it will be populated with requests to storage, status user and tags tables
    const storage = await item.getStorage({attributes: ['id', 'location', 'name', 'description', 'owner_id']});
    const tags = await item.getTags({attributes: ['id', 'tag']});
    let user = null;
    if (storage) {
        user = await storage.getUser({attributes: ['id', 'login']});
    }
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        image_url: "http://127.0.0.1",
        status: item.status,
        storage: storage,
        user: user,
        tags: tags
    }

};


async function getItems() {
    return Item.findAll().then(async (items) => {
        let itemsList = [];
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
        throw createError(412, 'Item not found');
    }
    return composeItemObjToSend(item);
}

async function changeItemById(itemID, body) {
    const item = await Item.findByPk(itemID);
    if (!item) {
        throw createError(412, 'Item not found');
    }
    if (body.image) {
        // relative path to the saved image is returned
        body.image = await saveBase64ToImage(body.image, 'items');
    }

    return item.update(body, {fields: ['name', 'description', 'image']}).then(() => {
        return composeItemObjToSend(item);
    });
}

async function deleteItemById(itemID) {
    const item = await Item.findByPk(itemID);
    if (!item) {
        throw createError(412, 'Item not found');
    }

    return item.destroy().then(() => {
        return {
            message: `Item (id: ${itemID}) successfully deleted!`
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