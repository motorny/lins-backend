import db from '../../database/models';
import * as Error from '../../common/constants';

async function addNewItem(item) {
    // todo: decode and save image to FS
    item.status = 0; // todo: set default status here
    item.storage_id = 25; // todo: set appropriate storage_id (get it from user's token)
    let errMsg = Error.CANNOT_INSERT_VALUE_INTO_TABLE;
    await db.items.create(item).then( () => {
        errMsg = Error.SUCCESS;
    });
    return errMsg;
}

export default {
    addNewItem,
}