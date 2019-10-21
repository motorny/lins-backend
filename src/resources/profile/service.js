import db from '../../database/models';

function registerNewUser(requestBody) {
    const user = {
        username: requestBody.username,
        password: requestBody.password,
        image_url: requestBody.image_url,
        location: requestBody.location,
        contact: requestBody.contact,
    };
    let newUser;
    db.profile.create(user);
    return newUser;
}

export default {
    registerNewUser,
}