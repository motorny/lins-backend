import {sequelizeBase, ItemStatus} from "./index";

function initDB () {
    sequelizeBase.sync({force: true}).then(() => {
        ItemStatus.bulkCreate([
            {status: "free"},
            {status: "occupied"}
        ]);
    });
}

initDB();