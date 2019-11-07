import Profile from "../../database/models";
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
    await Profile.findByPk(query.id).then( (user) => {
        if(!user) {
            retObj = Error.NO_SUCH_USER;
        } else {
            const values = user.dataValues;
            retObj = {
              username: values.username,
              location: values.location,
              contact: values.contact,
              image_url: values.image_url,
              role: values.role,
            };
        }
    });
    return retObj;
}

export default {
    registerNewUser,
    getUserPublicInfo,
}