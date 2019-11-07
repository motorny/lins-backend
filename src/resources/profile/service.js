import { Profile, Storage, Item } from '../../database/models';
import * as Error from '../../common/constants';

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
            throw Error.NO_SUCH_USER;
        } else {
            retObj = user.dataValues;
        }
    });
    /* Search for storage associated with given user */
    await Storage.findOne({ where: {owner_id: query.id} }).then(storage => {
        if(!storage) {
            throw Error.NO_STORAGE_ASSOCIATED;
        }
        else{
            const values = storage.dataValues;
            retObj = {...retObj, values };
        }
    });
    /* Search for items associated with given storage */
    await Item.findAll({ where: {storage_id: retObj.storage.id} }).then(items => {
        for(let i = 0; i < items.length; ++i) {
            const values = items[i].dataValues;
            retObj = {...retObj, values };
        }
    });
    return retObj;
}

export default {
    registerNewUser,
    getUserPublicInfo,
}