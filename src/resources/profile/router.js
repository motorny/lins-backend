import express from 'express';
import service from './service';

const router = express.Router();


function registerNewUser(request, response) {
    const { body } = request;
    // validate(body);
    const errMsg = service.registerNewUser(body);
    response.send(errMsg);
}

router.post("/newuser", registerNewUser);


router.get("/", (request, response) => {
    service.getAllUsers().then( (result) => {
        response.send(JSON.stringify(result));
    });
});

module.exports = router;