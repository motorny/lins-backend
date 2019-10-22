const Joi = require('joi');

const registerNewUserValidationSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    image_url: Joi.string(),
    location: Joi.string().required(),
    role: Joi.number().integer(),
    contact: Joi.string().required(),
    points: Joi.string(),
});

module.exports = {
    registerNewUserValidationSchema
};