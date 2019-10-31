import {version} from '../../package.json';

function getVersion() {
    return version;
}

const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};


module.exports = {
    getVersion,
    handleErrorAsync
};
