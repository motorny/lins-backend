import {Item, Storage, User} from "../../database/models";
import createError from "http-errors";
import Sequelize from "sequelize";
import logger from "../../common/logger";
import message from "../../common/constants";
import {composeOwnerObject} from "../profile/service";

async function addNewStorage(body) {
    const otherUsersStorages = await Storage.findAll({where: {owner_id: body.owner_id}})
    // create primary, if user does not have one.
    body.primary = !otherUsersStorages;
    return Storage.create(body).catch((err) => {
        if (err instanceof Sequelize.ForeignKeyConstraintError) {
            logger.info(`Can not assign storage to user with id: ${body.owner_id}. No such user`);
            throw createError(409, `Owner does not exist`)
        } else {
            throw err;
        }
    });
}

async function getOneStorage(id) {
    const storage = await Storage.findByPk(id, {
        attributes: ['id', 'name', 'location', 'description', 'owner_id']
    });
    if (!storage) {
        throw createError(404, message.NO_SUCH_STORAGE);
    }
    const owner = await composeOwnerObject(storage.owner_id);

    return {
        id: storage.id,
        location: storage.location,
        name: storage.name,
        description: storage.description,
        owner: owner,
    }
}

async function getAllOwnerStorage(id) {
    return Storage.findAll({
        where: {owner_id: id},
        attributes: ['id', 'name', 'location', 'description', 'owner_id'],
        include: [{
            model: User,
            attributes: ['id']
        }]
    }).then(async (storages) => {
        return {
            page: 1,
            totalCnt: storages.length,
            storages: storages
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