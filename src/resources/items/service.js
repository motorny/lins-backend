import db from '../../database/models';
import createError from 'http-errors'

async function addNewItem(item) {
    // todo: decode and save image to FS
    item.status = 0; // todo: set default status here
    item.storage_id = 25; // todo: set appropriate storage_id (get it from user's token)
    return db.items.create(item).then((createdItem) => {
        return {
            message: 'Success',
            id: createdItem.id
        };
    });
}

const composeItemObjToSend = async (item) => {
    // later it will be populated with requests to storage, status user and tags tables
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        image_url: "http://127.0.0.1" + item.image,
        status: item.status,
        storage: {"this is": "storage object"},
        user: {"this is": "user object"},
        tags: [{tag: 1}, {tag: 2}]
    }

};


async function getItems() {
    return db.items.findAll().then(async (items) => {
        const usersList = await Promise.all(Array.from(items, composeItemObjToSend));
        return {
            page: 1,
            totalCnt: items.length,
            items: usersList
        };
    });
}

async function getItemById(itemID) {
    const item = await db.items.findByPk(itemID);
    return composeItemObjToSend(item);
}

async function changeItemById(itemID, body) {
    const item = await db.items.findByPk(itemID);
    if (!item) {
        throw createError(412, 'Item not found');
    }
    return item.update(body, {fields: ['name', 'description', 'image']}).then(() => {
        return composeItemObjToSend(item);
    });
}

async function deleteItemById(itemID) {
    const item = await db.items.findByPk(itemID);
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