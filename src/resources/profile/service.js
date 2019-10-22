import db from '../../database/models';

function registerNewUser(requestBody) {
    db.profile.create(requestBody);
}

export default {
    registerNewUser,
}