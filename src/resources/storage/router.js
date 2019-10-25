import express from 'express';
import service from './service';

const router = express.Router();


function addNewStorage(request, response) {
    // validate(body);
    const { body } = request;
    service.addNewStorage(body);
    return response.json({
        body
    })
}

router.post("/newstorage", addNewStorage);


router.get("/", (request, response) => {
    service.getAllStorages().then( (result) => {
        response.send(JSON.stringify(result));
    });
});

module.exports = router;