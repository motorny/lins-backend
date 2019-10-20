import express from 'express';
import bodyParser from 'body-parser';
import service from './service';

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: false});

/* This method (at least for now) is getting fields from auth form */
router.post("/", urlencodedParser, function (request, response) {
    /* 1. Check for having something sent */
    if(!request.body) return response.sendStatus(400);
    service.registerNewUser(request.body);
    /* End: Response sent to client - TEMP PURP RIGHT NOW */
    response.send(JSON.stringify(`${request.body.username} + ${request.body.password}`));
});


router.get("/", urlencodedParser, (request, response) => {
    service.getAllUsers().then( (result) => {
        response.send(JSON.stringify(result));
    });
});

module.exports = router;