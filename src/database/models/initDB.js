import Item from './items';
import Storage from './storages';
import User from "./users";
import ItemStatus from "./itemStatuses";
import Profile from './profile';

import sequelizeBase from "./base";

sequelizeBase.sync({force: true});
