import Joi from "joi";

export  const userValidation = Joi.object({
    radiusMean : Joi.number().required(), 
    
})