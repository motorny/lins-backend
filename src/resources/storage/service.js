import Storage from "../../database/models/storage";

function addNewStorage(requestBody) {
    Storage.create(requestBody);
}

export default {
    addNewStorage,
    getAllStorages() {

    }
}