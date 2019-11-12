import {Storage} from "../../database/models";
import createError from "http-errors";

async function addNewStorage(requestBody) {
    return Storage.create(requestBody);
}

async function getOneStorage(id) {
    return Storage.findByPk(id, {attributes:['id', 'name', 'location', 'description', 'owner_id']});
}

async function getAllOwnerStorage(id) {
    return Storage.findAll({where: {owner_id: id},
        attributes:['id', 'name', 'location', 'description', 'owner_id']}).then(async (storages) => {
            const storageList = await Promise.all(Array.from(storages));
        return {
            page: 1,
            totalCnt: storages.length,
            storages: storageList
        };
    });
}

async function changeStorageById(id, body) {
    const storage = await Storage.findByPk(id);
    if (!storage) {
        throw createError(412, 'Storage not found');
    }
    return storage.update(body, {fields: ['name', 'location', 'description', 'owner_id']}).then(() => {
        return storage;
    });
}

export default {
    addNewStorage,
    getOneStorage,
    getAllOwnerStorage,
    changeStorageById
}