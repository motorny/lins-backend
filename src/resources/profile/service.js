import { Profile, Storage, Item, User } from '../../database/models';
import * as Error from '../../common/constants';
import createError from 'http-errors';

async function registerNewUser(requestBody) {
    let errMsg = Error.CANNOT_INSERT_VALUE_INTO_TABLE;
    await Profile.create(requestBody).then( () => {
        errMsg = Error.SUCCESS;
    });
    return errMsg;
}

async function getUserPublicInfo(query) {
    let retObj;
    /* Search for public information about user - location, username etc */
    await Profile.findByPk(query.id).then( (user) => {
        if(!user) {
            throw createError(400, Error.NO_SUCH_USER);
        } else {
            retObj = user.dataValues;
        }
    });
    /* Search for storage associated with given user */
    await Storage.findOne({ where: {owner_id: query.id} }).then(storage => {
        if(!storage) {
            throw createError(400, Error.NO_STORAGE_ASSOCIATED);
        }
        else{
            const values = storage.dataValues;
            retObj = {...retObj, storage: values };
        }
    });
    /* Search for items associated with given storage */
    await Item.findAll({ where: {storage_id: retObj.storage.id} }).then(items => {
        for(let i = 0; i < items.length; ++i) {
            const values = items[i].dataValues;
            retObj = {...retObj, items: values };
        }
    });
    return retObj;
}

async function updateUserInfo(userInfo){
    /* Check if it's our profile */
    let privilege;
    let targetPrivilege;
    await Profile.findByPk(userInfo.id).then( (user) => {
        if(!user) {
            throw createError(400, Error.NO_SUCH_USER);
        } else {
            privilege = (user.id === userInfo.id); // privilege = true if it's our profile
            targetPrivilege = user.role;
        }
    });
    /* Check if we are admins */
    let adminPrivilege;
    await User.findByPk(userInfo.currentUser).then( (user) => {
        if(!user) {
            throw createError(400, Error.NO_SUCH_USER);
        } else {
            adminPrivilege = user.isAdmin; // adminPrivilege = true if we are admins
        }
    });
    if (!(adminPrivilege || privilege)) {
        throw createError(400, 'Not enough privilege');
    }
    await Profile.update(
        userInfo,
        {where: {id: userInfo.id}}
    );
    let test;
    test = 1 + 2;
    if (targetPrivilege !== userInfo.role) {
        await User.update(
            {isAdmin: userInfo.role === 'admin'? 1: 0},
            {where: {id: userInfo.id}}
        );
    }
    return {
        message: 'Success'
    }
}

async function deleteUser(requestParams) {
    const { id } = requestParams;
    let adminPrivilege;
    await User.findByPk(requestParams.currentUser).then( (user) => {
        if(!user) {
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
    registerNewUser,
    getUserPublicInfo,
    updateUserInfo,
    deleteUser,
}