import {Storage} from "../../database/models";
import createError from "http-errors";
import Sequelize from "sequelize";
import logger from "../../common/logger";
import message from "../../common/constants";
import {getStorageByIDFromDb, getUsersStorageFromDb} from "./queries";
import {composeStorageFull, composeStorageMinified} from "./mapper";
import {composeURL, STORAGES_E_N} from "../../common/endpointNames";
import urljoin from "url-join";

async function addNewStorage(body) {
    const otherUsersStorages = await Storage.findAll({where: {owner_id: body.owner_id}});
    // create primary, if user does not have one.
    body.primary = !otherUsersStorages;
    const createdStorage = await Storage.create(body).catch((err) => {
        if (err instanceof Sequelize.ForeignKeyConstraintError) {
            logger.info(`Can not assign storage to user with id: ${body.owner_id}. No such user`);
            throw createError(409, `Owner does not exist`)
        } else {
            throw err;
        }
    });
    return {
        message: 'Success',
        id: createdStorage.id,
        _links: {_self: composeURL(urljoin(STORAGES_E_N, createdStorage.id.toString()))}
    };
}

async function getOneStorage(id, includeItemsLimit) {
    const storage = await getStorageByIDFromDb(id, includeItemsLimit);
    if (!storage) {
        throw createError(404, message.NO_SUCH_STORAGE);
    }
    return composeStorageFull(storage, includeItemsLimit);
}

async function getAllOwnerStorage(userId) {
    const storages = await getUsersStorageFromDb(userId).then((storages) => {
        return Array.from(storages, composeStorageMinified)
    });
    return {
        page: 1,
        owner: {id: userId},
        totalCnt: storages.length,
        storages: storages
    };
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