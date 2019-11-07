import Item from './items';
import Storage from './storages';
import User from "./users";
import ItemStatus from "./itemStatuses";

import sequelizeBase from "./base";


function initDB () {
    sequelizeBase.sync({force: true}).then(() => {
        ItemStatus.bulkCreate([
            {status: "free"},
            {status: "occupied"}
        ]);
    });
}

//initDB();

export {Item, Storage, User, ItemStatus};
