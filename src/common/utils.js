import {version} from '../../package.json';
import createError from 'http-errors'

function getVersion() {
    return version;
}

const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch(next);
};


function throwMethodNotAllowed(allowed_list) {
    return () => {
        throw createError(405, `Allowed methods ${allowed_list}`)
    };
}

export {
    getVersion,
    handleErrorAsync,
    throwMethodNotAllowed
};
