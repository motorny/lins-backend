import {getVersion as utilsGetVersion} from "../../common/utils";

function getVersion(req, res, next) {
    console.log("Version requested");
    return res.send({version: utilsGetVersion()})
}


export {
    getVersion
};