import {Storage} from "../../database/models";

async function addNewStorage(requestBody) {
    return Storage.create(requestBody);
}

async function getOneStorage(id) {
    return Storage.findByPk(id, {attributes:['id', 'name', 'location', 'description', 'owner_id']});
}

async function getAllOwnerStorage(owner_id) {
    return Storage.findAll({where: {owner_id: owner_id},
        attributes:['id', 'name', 'location', 'description', 'owner_id']}).then(async (storages) => {
            const storageList = await Promise.all(Array.from(storages));
        return {
            page: 1,
            totalCnt: storages.length,
            storages: storageList
        };
    });
}

export default {
    addNewStorage,
    getOneStorage,
    getAllOwnerStorage
}