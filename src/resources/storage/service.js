import db from '../../database/models';

function addNewStorage(requestBody) {
    db.storage.create(requestBody);
}

export default {
    addNewStorage,
    getAllStorages() {

    }
}