'user strict';

const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required()
    })
}; 

  