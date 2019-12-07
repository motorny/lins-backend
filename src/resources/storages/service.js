import {Storage, User} from "../../database/models";
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
    logger.info(`Storage will be created as primary: ${body.primary}`);
    const createdStorage = await Storage.create(body).catch((err) => {
        if (err instanceof Sequelize.ForeignKeyConstraintError) {
            logger.info(`Can not assign storage to user with id: ${body.owner_id}. No such user`);
            throw createError(409, `Owner does not exist`)
        } else {
            throw err;
        }
    });
    logger.debug(`Storage ${createdStorage.name} created with id: ${createdStorage.id}`);
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
    await User.findByPk(userId).then((res) => {
        if (!res) {
            throw createError(412, 'No such user');
        }
    });
    const storages = await getUsersStorageFromDb(userId).then((storages) => {
        logger.debug(`Got ${storages.length} storages from DB`);
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
            logger.debug(`User ${user.login} does not own storage ${storage.id}, modification failed`);
            throw createError(403, 'Permission denied');
        }
        if (body.owner_id) {
            // Can not reassign storage, if not Admin
            logger.debug(`User ${user.login} does not own storage ${storage.id}, reassigning failed`);
            throw createError(403, 'Permission denied');
        }
    }

    return storage.update(body, {fields: ['name', 'location', 'description', 'owner_id']});
}

async function deleteStorageById(id) {
    const storage = await Storage.findByPk(id);
    if (!storage) {
        throw createError(412, 'Storage not found');
    }
    const assignOtherAsPrimary = storage.primary;
    const storageOwner = await storage.getUser({attributes:['id']});
    console.log(storageOwner.id);
    if(!storageOwner){
        throw createError(500, 'Data inconsistency');
    }
    await storage.destroy().then(() => {
        logger.info(`Storage (id: ${id}) deleted`);
    });
    if (assignOtherAsPrimary) {
        const otherUserStorage = await Storage.findOne({where: {owner_id: storageOwner.id}});
        if( otherUserStorage) {
            await otherUserStorage.update({primary: true});
            logger.info(`Storage (id: ${otherUserStorage.id}) was set as primary`);
        } else {
            logger.info(`This was last storage of user ${storageOwner.id}, but`)
        }
    }
    return {
        message: 'Success'
    }
}

export default {
    addNewStorage,
    getOneStorage,
    getAllOwnerStorage,
    changeStorageById,
    deleteStorageById
}