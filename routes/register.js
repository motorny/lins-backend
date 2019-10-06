const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();



const urlencodedParser = bodyParser.urlencoded({extended: false});

router.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send(JSON.stringify(`${request.body.username} - ${request.body.password}`));
});

module.exports = router;