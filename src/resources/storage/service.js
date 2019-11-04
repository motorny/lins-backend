import db from '../../database/models';

function addNewStorage(requestBody) {
    db.storage.create(requestBody);
}

async function getOneStorage(query) {
    return db.storage.findByPk(query.id, {attributes:['id', 'name', 'location', 'description', 'owner_id']});
}

export default {
    addNewStorage,
    getOneStorage
}