import express from 'express';
import service from './service';

import * as validationSchemas from './validation/validation';

const router = express.Router();

function handlePostAddNewItem(request, response) {
    const {body} = request;
    service.addNewItem(body).then((result) => {
        response.send(result);
    }).catch((err) => {
        response.status(500).send({message: "Oooops! Internal server error"});
    });
}

function handleGetItems(request, response) {
    service.getItems().then((result) => {
        response.send(result);
    });
}


function handleGetItemById(request, response) {
    const id = parseInt(request.params.id);
    service.getItemById(id).then((result) => {
        response.send(result);
    });
}

router.post("/", handlePostAddNewItem);
router.get("/:id", handleGetItemById);
router.get("/", handleGetItems);

module.exports = router;