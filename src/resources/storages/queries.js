import {Item, Profile, Storage, User} from "../../database/models";
import Sequelize from "sequelize";

export async function getStorageByIDFromDb(storageId, includeItemsLimit) {
    const joinOpts = [
        {
            model: User,
            attributes: ['id'],
            include: [{
                model: Profile,
                attributes: ['id', 'username', 'image', 'contact', 'points']
            }],
        },
    ];
    let includeOpts = ['id', 'name', 'location', 'createdAt', 'updatedAt'];
    if (includeItemsLimit) {
        joinOpts.push({
            model: Item,
            attributes: ['id', 'name', 'image', 'description'],
            limit: includeItemsLimit
        });
    } else {
        // get all ids to count related items otherwise
        joinOpts.push({
            model: Item,
            attributes: ['id'],
        });
    }

    return Storage.findByPk(storageId, {
        attributes: includeOpts,
        include: joinOpts
    });
}

export async function getUsersStorageFromDb(userId) {
    return Storage.findAll({
        where: {owner_id: userId},
        attributes: ['id', 'name', 'location',],
        include: [
            {
                model: Item,
                attributes: ['id'],
            },
        ]
    });
}


export async function countItemsOfStorages() {
    return Storage.findAll({
        attributes: [['id', 'stid'], [Sequelize.fn("COUNT", Sequelize.col("items.id")), "items_count"]],
        group: 'stid',
        include: [
            {
                model: Item,
                attributes: ['id'],
            },
        ]
    });
}
