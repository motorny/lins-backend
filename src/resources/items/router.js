import express from 'express';
import service from './service';

import * as validationSchemas from './validation/validation';

const router = express.Router();

function handlePostAddNewItem(request, response) {
    const {body} = request;
    service.addNewItem(body).then((result) => {
        response.send(
            {"message": result}
        );
    });
}

function handleGetItems(request, response) {
    const {body} = request;
    service.getItems().then((result) => {
        response.send(result);
    });
}

router.post("/", handlePostAddNewItem);
router.get("/", handleGetItems);

module.exports = router;