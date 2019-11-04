import express from 'express';
import service from './service';
import message from '../../common/constants.js';

const router = express.Router();


function addNewStorage(request, response) {
    // validate(body);
    const {body} = request;
    service.addNewStorage(body);
    return response.json({
        body
    });
}

async function getOneStorage(request, response) {
    // validate(body);
    const {query} = request;
    const res = service.getOneStorage(query);
    await res.then(function (res) {
        if(res == null)
            res = message.NO_SUCH_STORAGE;
        return response.json(res);
    });
}

router.post("/newstorage", addNewStorage);
router.get("/", getOneStorage);

module.exports = router;