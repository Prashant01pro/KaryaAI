import Joi from 'joi'

const objectId = Joi.string().hex().length(24)

export const createUserValidation = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    username: Joi.string().trim().min(5).max(20).lowercase().required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().valid('admin', 'user').default('user'),
    provider: Joi.string().valid('local', 'google', 'github').default('local')
})

export const updateUserValidation = Joi.object({
    name: Joi.string().trim().min(2).max(50),
    username: Joi.string().trim().min(5).max(20).lowercase(),
    email: Joi.string().trim().email().lowercase(),
    password: Joi.string().min(6).max(128),
    role: Joi.string().valid('admin', 'user'),
    provider: Joi.string().valid('local', 'google', 'github')
}).min(1)

export const userIdValidation = Joi.object({
    userId: objectId.required()
})

export const userQueryValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    role: Joi.string().valid('admin', 'user'),
    provider: Joi.string().valid('local', 'google', 'github'),
    name: Joi.string().trim().max(50).allow(''),
    username: Joi.string().trim().max(20).allow(''),
    email: Joi.string().trim().max(100).allow(''),
    search: Joi.string().trim().max(100).allow(''),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email', 'username', 'role', 'provider').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    createdFrom: Joi.date().iso(),
    createdTo: Joi.date().iso().min(Joi.ref('createdFrom'))
})
