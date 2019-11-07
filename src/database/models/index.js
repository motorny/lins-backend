import Item from './items';
import Storage from './storage';
import User from "./user";
import ItemStatus from "./itemStatuses";
import Profile from './profile';

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

export {Item, Storage, User, ItemStatus, Profile};
