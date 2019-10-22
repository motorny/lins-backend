const Joi = require('joi');

const registerNewUserValidationSchema = Joi.object().keys({
    username: Joi.string().min(1),
    password: Joi.string().min(7),
    image_url: Joi.string(),
    location: Joi.string().min(1),
    role: Joi.number().integer(),
    contact: Joi.string().min(1),
    points: Joi.string(),
});

module.exports = {
    registerNewUserValidationSchema
};