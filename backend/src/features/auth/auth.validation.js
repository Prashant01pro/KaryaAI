import joi from 'joi'

export const authRegisterValidation = joi.object({
    name: joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    username: joi.string()
        .trim()
        .min(5)
        .max(20)
        .lowercase()
        .required(),

    email: joi.string()
        .trim()
        .email()
        .lowercase()
        .required(),

    password: joi.string()
        .min(6)
        .max(128)
        .required()
})

export const authLoginValidation = joi.object({
    email: joi.string()
        .trim()
        .email()
        .lowercase()
        .required(),

    password: joi.string()
        .min(6)
        .required()
})
