import db from '../../../database/models';


class UserService {
    static async addUser(database, newUser) {
        try {
            return await database.users.create(newUser);
        } catch (error) {
            throw error;
        }
    }

}

function registerNewUser(requestBody) {
    console.log(requestBody);
    // TEMP SOLUTION: WE HAVE USERNAME IN RESPONSE BUT NAME IN TABLE!
    const user = {
        name: requestBody.username,
        password: requestBody.password,
    };
    // TODO: ADD ERROR RESPONSE
    UserService.addUser(db, user);
    /* 2. Password is encrypted? Need to search in DB for that user and password */
}

function getAllUsers() {
    return db.users.findAll();
    db.users.findAll({
        raw: true,
        //Other parameters
    }).then(users => {
        return users;
    })
}

export default {
    registerNewUser,
    getAllUsers,
}