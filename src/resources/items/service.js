import db from '../../database/models';
import * as Error from '../../common/constants';

async function addNewItem(item) {
    // todo: decode and save image to FS
    item.status = 0; // todo: set default status here
    item.storage_id = 25; // todo: set appropriate storage_id (get it from user's token)
    let errMsg = Error.CANNOT_INSERT_VALUE_INTO_TABLE;
    await db.items.create(item).then(() => {
        errMsg = Error.SUCCESS;
    });
    return errMsg;
}


async function getItems() {
    let retObj;
    await db.items.findAll().then((users) => {
        const usersList = Array.from(users, (u) => {
            return {
                id: u.id,
                name: u.name,
                description: u.description,
                image_url: "http://127.0.0.1" + u.image,
                status: u.status,
                storage: {"this is": "storage object"},
                user: {"this is": "user object"},
                tags: [{tag: 1}, {tag: 2}]
            }
        });
        retObj = {
            page: 1,
            totalCnt: users.length,
            items: usersList
        };
    });
    return retObj;
}

export default {
    addNewItem,
    getItems
}