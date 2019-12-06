import {getMediaUrl} from "../../common/staticHandlers";


export function composeStorageFull(dbRes) {
    let owner = null;
    if (dbRes.user) {
        owner = {id: dbRes.user.id};
        if (dbRes.user.profile) {
                owner.username = dbRes.user.profile.username;
                owner.image_url = getMediaUrl(dbRes.user.profile.image_url);
                owner.contact = dbRes.user.profile.contact;
                owner.points = dbRes.user.profile.points;
        }
    }
    const result = {
        id: dbRes.id,
        name: dbRes.name,
        location: dbRes.location,
        description: dbRes.description,
        createdAt: dbRes.createdAt,
        updatedAt: dbRes.updatedAt,
        owner: owner
    };

    if (dbRes.items){
        result.items = dbRes.items;
    }
    return result
}