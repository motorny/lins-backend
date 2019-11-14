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

const getUserInfoValidationSchema = Joi.object().keys({
    id: Joi.number().integer().required(),
});

const deleteUserValidationSchema = Joi.object().keys({
    id: Joi.number().integer().required(),
});


const updateUserInfoValidationSchema = Joi.object().keys({
    id: Joi.number().integer().required(),
    username: Joi.string(),
    password: Joi.string(),
    image_url: Joi.string(),
    location: Joi.string(),
    role: Joi.number().integer(),
    contact: Joi.string(),
    points: Joi.string(),
});

module.exports = {
    registerNewUserValidationSchema,
    getUserInfoValidationSchema,
    updateUserInfoValidationSchema,
    deleteUserValidationSchema,
};