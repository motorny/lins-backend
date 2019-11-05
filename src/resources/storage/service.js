import Storage from "../../database/models";

function addNewStorage(requestBody) {
    Storage.create(requestBody);
}

export default {
    addNewStorage,
    getAllStorages() {

    }
}