const Joi = require('joi');

module.exports = {
    login : Joi.object().keys({
        email : Joi.string().email().required(),
        password: Joi.string().required()
    }),
    email: Joi.object().keys({
        email: Joi.string().email().required()
    }),
    resetPasswordToken: Joi.object().keys({
        token: Joi.string().required(),
        password: Joi.string().min(3).required()
    })
};