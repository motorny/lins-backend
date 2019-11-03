import {version} from '../../package.json';
import createError from 'http-errors'

function getVersion() {
    return version;
}

const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};

function catchRejects(fn) {
    return function(req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
}

function throwMethodNotAllowed(allowed_list) {
    return () => {
        throw createError(405, `Allowed methods ${allowed_list}`)
    };
}

module.exports = {
    getVersion,
    handleErrorAsync,
    catchRejects,
    throwMethodNotAllowed
};
