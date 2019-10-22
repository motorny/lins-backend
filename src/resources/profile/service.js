import db from '../../database/models';
import * as Error from '../../common/constants';

async function registerNewUser(requestBody) {
    let errMsg = Error.CANNOT_INSERT_VALUE_INTO_TABLE;
    await db.profile.create(requestBody).then( () => {
        errMsg = Error.SUCCESS;
    });
    return errMsg;
}

export default {
    registerNewUser,
}