export const ITEMS_E_N = '/items';
export const PROFILES_E_N = '/profile';
export const STORAGES_E_N = '/storages';
export const COMMENTS_E_N = '/comments';
export const AUTH_E_N = '/auth';
export const TAGS_E_N = '/tags';
export const USERS_E_N = '/users';
export const VERSION_E_N = '/version';


export function composeURL(path){
    const url = new URL(path, process.env.ENTRY_HOST_URL);
    return url.href;
}

