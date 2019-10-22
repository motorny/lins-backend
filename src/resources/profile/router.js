import express from 'express';
import service from './service';
import Joi from 'joi';
import * as validationSchemas from './validation/validation';
const { promisify } = require("es6-promisify");

const router = express.Router();

function registerNewUser (request, response) {
    const { body } = request;
    const res = Joi.validate(request, validationSchemas.registerNewUserValidationSchema);
    if(!res.error) {
        const errMsg = service.registerNewUser(body);
    }
    response.send(res.error);
};

router.post("/newuser", registerNewUser);


router.get("/", (request, response) => {
    service.getAllUsers().then( (result) => {
        response.send(JSON.stringify(result));
    });
});

module.exports = router;