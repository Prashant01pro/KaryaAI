import AppError from '../../utils/appError.js'

const validateRequestPart = (schema, key) => (req, res, next) => {
    const { error, value } = schema.validate(req[key], {
        abortEarly: false,
        stripUnknown: true
    })

    if (error) {
        return next(new AppError(error.details.map((detail) => detail.message).join(', '), 400))
    }

    req[key] = value
    next()
}

export const validateBody = (schema) => validateRequestPart(schema, 'body')
export const validateQuery = (schema) => validateRequestPart(schema, 'query')
export const validateParams = (schema) => validateRequestPart(schema, 'params')
