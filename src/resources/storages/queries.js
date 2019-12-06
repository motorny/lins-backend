import {Item, Profile, Storage, User} from "../../database/models";

export async function getStorageByIDFromDb(storageId, includeItemsLimit) {
    const joinOpts = [
        {
            model: User,
            attributes: ['id'],
            include: [{
                model: Profile,
                attributes: ['id', 'username', 'image_url', 'contact', 'points']
            }],
        },
    ];
    if (includeItemsLimit) {
        joinOpts.push({
            model: Item,
            attributes: ['id', 'name', 'image', 'description'],
            limit: includeItemsLimit
        });
    }

    return Storage.findByPk(storageId, {
        attributes: ['id', 'name', 'location', 'createdAt', 'updatedAt'],
        include: joinOpts
    });
}
