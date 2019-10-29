import express from 'express';
import service from './service';

import * as validationSchemas from './validation/validation';

const router = express.Router();

function handlePostAddNewItem(request, response) {
    const {body} = request;
    service.addNewItem(body).then((result) => {
        response.send(JSON.stringify(result));
    });
}

router.post("/", handlePostAddNewItem);

module.exports = router;