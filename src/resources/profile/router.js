import express from 'express';
import service from './service';
import Joi from 'joi';
import * as validationSchemas from './validation/validation';

const router = express.Router();

function registerNewUser (request, response) {
    const { body } = request;
    Joi.validate(body, validationSchemas.registerNewUserValidationSchema, async (error, value) => {
        if(error) {
            response.send(error);
        } else {
            const errMsg = await service.registerNewUser(value);
            response.send(errMsg);
        }
    });
}

router.post("/newuser", registerNewUser);


router.get("/", (request, response) => {
    service.getAllUsers().then( (result) => {
        response.send(JSON.stringify(result));
    });
});

module.exports = router;