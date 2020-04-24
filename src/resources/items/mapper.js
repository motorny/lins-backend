import {getMediaUrl} from "../../common/staticHandlers";
import {composeURL, ITEMS_E_N, PROFILES_E_N} from "../../common/endpointNames";
import urljoin from "url-join";

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
                owner.image_url = getMediaUrl(item.storage.user.profile.image);
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
        status: status,
        _links: {_self: composeURL(urljoin(ITEMS_E_N, item.id.toString()))}
    }
};

export const composeItemObjToSendFull = (item) => {
    let owner = null;
    let storage = null;
    let location = null;
    let profileId = null;
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
                owner.image_url = getMediaUrl(item.storage.user.profile.image);
                owner.contact = item.storage.user.profile.contact;
                owner.points = item.storage.user.profile.points;
                profileId = item.storage.user.profile.id;
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
        _links: {_self: composeURL(urljoin(ITEMS_E_N, item.id.toString())),
        _owner_profile: profileId && composeURL(urljoin(PROFILES_E_N, profileId.toString()))}
    }
};