import {Item, Storage, User} from "../../database/models";
import createError from "http-errors";

async function addNewStorage(body) {
    const otherUsersStorages = await Storage.findAll({where: {owner_id: body.owner_id}});
    // create primary, if user does not have one.
    body.primary = !otherUsersStorages;
    return Storage.create(body);
}

async function getOneStorage(id) {
    const storage = await Storage.findByPk(id, {
        attributes: ['id', 'name', 'location', 'description'],
        include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'login']
        }]
    });
    return storage;
}

async function getAllOwnerStorage(id) {
    return Storage.findAll({
        where: {owner_id: id},
        attributes: ['id', 'name', 'location', 'description', 'owner_id'],
        include: [{
            as: 'owner',
            model: User,
            attributes: ['id', 'login']
        }]
    }).then(async (storages) => {
        const storageList = await Promise.all(Array.from(storages));
        return {
            page: 1,
            totalCnt: storages.length,
            storages: storageList
        };
    });
}

async function changeStorageById(id, body, user) {
    const storage = await Storage.findByPk(id);
    if (!storage) {
        throw createError(412, 'Storage not found');
    }
    if (!user.isAdmin) {
        if (storage.owner_id !== user.id) {
            // Can not modify not owned storage, if not Admin
            throw createError(403, 'Permission denied');
        }
        if (body.owner_id) {
            // Can not reassign storage, if not Admin
            throw createError(403, 'Permission denied');
        }
    }
    // todo: handle update of 'primary' status

    return storage.update(body, {fields: ['name', 'location', 'description', 'owner_id']});
}

async function deleteStorageById(id) {
    const storage = await Storage.findByPk(id);
    if (!storage) {
        throw createError(412, 'Storage not found');
    }
    return storage.destroy().then(() => {
        return {
            message: `Storage (id: ${id}) successfully deleted!`
        }
    });
}

export default {
    addNewStorage,
    getOneStorage,
    getAllOwnerStorage,
    changeStorageById,
    deleteStorageById
}