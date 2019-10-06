const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();



const urlencodedParser = bodyParser.urlencoded({extended: false});

/* This method (at least for now) is getting fields from auth form */
router.post("/", urlencodedParser, function (request, response) {
    /* 1. Check for having something sent */
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    /* 2. Password is encrypted? Need to search in DB for that user and password */
    /* End: Response sent to client */
    response.send(JSON.stringify(`${request.body.username} - ${request.body.password}`));
});

module.exports = router;