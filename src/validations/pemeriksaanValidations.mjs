import Joi from "joi";

export  const pemeriksaanValidations = Joi.object({
    radiusMean : Joi.number().required(), 
    textureMean : Joi.number().required(), 
    perimeterMean : Joi.number().required(), 
    areaMean :Joi.number().required(),
    smoothnessMean :Joi.number().required(), 
    compactnessMean : Joi.number().required(), 
    concavityMean : Joi.number().required(), 
    idAccount : Joi.number().required()
})