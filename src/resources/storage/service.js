import Storage from "../../database/models";

function addNewStorage(requestBody) {
    Storage.create(requestBody);
}

async function getOneStorage(query) {
    return db.storage.findByPk(query.id, {attributes:['id', 'name', 'location', 'description', 'owner_id']});
}

export default {
    addNewStorage,
    getOneStorage
}