import {Profile, Storage, Item, User} from '../../database/models';
import * as Error from '../../common/constants';
import createError from 'http-errors';
import {saveBase64ToImage, getMediaUrl} from "../../common/staticHandlers";
import logger from "../../common/logger";

async function createNewProfile(requestBody) {
    /* Check if we are admins */
    let adminPrivilege;
    await User.findByPk(requestBody.currentUser).then((user) => {
        if (!user) {
            throw createError(400, Error.NO_SUCH_USER);
        } else {
            adminPrivilege = user.isAdmin; // adminPrivilege = true if we are admins
        }
    });
    if (!adminPrivilege) {
        throw createError(400, 'Not enough privilege');
    }
    if (requestBody.image) {
        // relative path to the saved image is returned
        requestBody.image = await saveBase64ToImage(requestBody.image, 'profile');
        logger.debug(`Image saved to media storage`);
    }
    let errMsg = Error.CANNOT_INSERT_VALUE_INTO_TABLE;
    await Profile.create(requestBody).then(() => {
        errMsg = Error.SUCCESS;
    });
    return errMsg;
}

export async function composeOwnerObject(userID) {
    if (!userID)
        return null;
    const profile = await Profile.findOne({
        where: {user_id: userID},
        attributes: [['id', 'profile_id'], 'username', 'image', 'location', 'contact', 'points']
    });
    if (!profile) {
        return {
            id: userID
        };
    }
    profile.image_url = getMediaUrl(profile.image);
    return {
        id: userID,
        ...profile.dataValues
    }
}


async function getUserPublicInfo(query) {
    let retObj = {
        user: {},
        storages: [],
        items: [],
    };
    /* Search for public information about user - location, username etc */
    await Profile.findByPk(query.id).then((user) => {
        if (!user) {
            throw createError(400, Error.NO_SUCH_USER);
        } else {
            retObj.user = user;
        }
    });
    /* Search for storage associated with given user */
    await Storage.findAll({where: {owner_id: query.id}}).then(async (storages) => {
        retObj.storages = storages;
        /* Search for items associated with given storage */
        for (let j = 0; j < storages.length; ++j) {
            await Item.findAll({where: {storage_id: storages[j].id}}).then(items => {
                for(let i = 0; i< items.length; ++i) {
                   items[i].dataValues.image_url = getMediaUrl(items[i].image);
                }
                retObj.items = items;
            });
        }
    });
    return retObj;
}

async function updateUserInfo(userInfo) {
    /* Check if it's our profile */
    let privilege;
    let targetPrivilege;
    await Profile.findByPk(userInfo.id).then((user) => {
        if (!user) {
            throw createError(400, Error.NO_SUCH_USER);
        } else {
            privilege = (user.id === userInfo.currentUser); // privilege = true if it's our profile
            targetPrivilege = user.role;
        }
    });
    /* Check if we are admins */
    let adminPrivilege;
    await User.findByPk(userInfo.currentUser).then((user) => {
        if (!user) {
            throw createError(400, Error.NO_SUCH_USER);
        } else {
            adminPrivilege = user.isAdmin; // adminPrivilege = true if we are admins
        }
    });
    if (!(adminPrivilege || privilege)) {
        throw createError(400, 'Not enough privilege');
    }
    if (userInfo.image) {
        // relative path to the saved image is returned
        userInfo.image = await saveBase64ToImage(userInfo.image, 'profile');
        logger.debug(`Image saved to media storage`);
    }
    await Profile.update(
        userInfo,
        {where: {id: userInfo.id}}
    );
    return {
        message: 'Success'
    }
}

async function deleteUser(requestParams) {
    const {id} = requestParams;
    let adminPrivilege;
    await User.findByPk(requestParams.currentUser).then((user) => {
        if (!user) {
            throw createError(400, Error.NO_SUCH_USER);
        } else {
            adminPrivilege = user.isAdmin; // adminPrivilege = true if we are admins
        }
    });
    if (!adminPrivilege) {
        throw createError(400, 'Not enough privilege');
    }
    const profileToDelete = await Profile.findByPk(id);
    if (!profileToDelete) {
        throw createError(412, 'Profile not found');
    }
    await profileToDelete.destroy().then(() => {
        return Error.SUCCESS;
    });
}

export default {
    createNewProfile,
    getUserPublicInfo,
    updateUserInfo,
    deleteUser,
}