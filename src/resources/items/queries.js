import {Item, ItemStatus, Profile, Storage, Tag, User} from "../../database/models";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

const genereateItemsSearchExpr = (filter) => {
    return {
        [Op.or]: [
            {
                name: {[Op.substring]: filter}
            },
            {
                description: {[Op.substring]: filter}
            }
        ]
    };
};

export async function countAllItems(filter) {
    let whereExpr = undefined;
    if (filter) {
        whereExpr = genereateItemsSearchExpr(filter)
    }
    return Item.count({
        where: whereExpr,
        attributes: ['id', 'name', 'description'],
    });
}


export async function getAllItemsFromDb(filter, offset, limit) {
    let whereExpr = undefined;
    if (filter) {
        whereExpr = genereateItemsSearchExpr(filter);
    }
    return Item.findAll({
        offset: offset,
        limit: limit,
        where: whereExpr,
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
