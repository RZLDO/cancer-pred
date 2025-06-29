// validations/authValidations.mjs
import Joi from 'joi';

export const params = Joi.object({
    id : Joi.required()
});

export const queryPaging = Joi.object({
    page : Joi.required(), 
    limit : Joi .required()
})
