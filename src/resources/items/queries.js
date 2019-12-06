import {Item, ItemStatus, Profile, Storage, Tag, User} from "../../database/models";


export async function getAllItemsFromDb() {
    return Item.findAll({
        attributes: ['id', 'name', 'image', 'description'],
        include: [
            {
                model: Storage,
                attributes: ['id', 'location'],
                include: [{
                    model: User,
                    attributes: ['id'],
                    include: [{
                        model: Profile,
                        attributes: ['id', 'username', 'image_url']
                    }]
                }]
            },
            ItemStatus]
    });
}

export async function getItemByIdFromDb(itemID) {
    return Item.findByPk(itemID, {
        attributes: ['id', 'name', 'image', 'description', 'createdAt', 'updatedAt'],
        include: [
            {
                model: Storage,
                attributes: ['id', 'name', 'location'],
                include: [{
                    model: User,
                    attributes: ['id'],
                    include: [{
                        model: Profile,
                        attributes: ['id', 'username', 'image_url', 'contact', 'points']
                    }]
                }]
            },
            {
                model: Tag,
                attributes: ['id', 'tag'],
                through: {
                    attributes: []
                }
            },
            ItemStatus]
    });
}
