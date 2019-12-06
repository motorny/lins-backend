import {getMediaUrl} from "../../common/staticHandlers";

export const composeItemObjToSendMinified = (item) => {
    let owner = null;
    let location = null;
    const status = item.itemStatus && item.itemStatus.status;
    if (item.storage) {
        location = item.storage.location;
        if (item.storage.user) {
            owner = {id: item.storage.user.id};
            if (item.storage.user.profile) {
                owner.username = item.storage.user.profile.username;
                owner.image_url = getMediaUrl(item.storage.user.profile.image_url);
            }
        }
    }

    return {
        id: item.id,
        name: item.name,
        description: item.description,
        location: location,
        image_url: getMediaUrl(item.image),
        owner: owner,
        status: status
    }
};

export const composeItemObjToSendFull = (item) => {
    let owner = null;
    let storage = null;
    let location = null;
    const status = item.itemStatus && item.itemStatus.status;
    if (item.storage) {
        location = item.storage.location;
        storage = {
            id: item.storage.id,
            name: item.storage.name
        };
        if (item.storage.user) {
            owner = {id: item.storage.user.id};
            if (item.storage.user.profile) {
                owner.username = item.storage.user.profile.username;
                owner.image_url = getMediaUrl(item.storage.user.profile.image_url);
                owner.contact = item.storage.user.profile.contact;
                owner.points = item.storage.user.profile.points;
            }
        }
    }

    return {
        id: item.id,
        name: item.name,
        description: item.description,
        location: location,
        image_url: getMediaUrl(item.image),
        storage: storage,
        owner: owner,
        tags: item.tags,
        status: status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    }
};