import {Storage} from "../../database/models";

async function addNewStorage(requestBody) {
    return Storage.create(requestBody);
}

async function getOneStorage(id) {
    return Storage.findByPk(id, {attributes:['id', 'name', 'location', 'description', 'owner_id']});
}

export default {
    addNewStorage,
    getOneStorage
}