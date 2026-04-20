import AppError from '../../utils/appError.js'

const validateRequestPart = (schema, key) => (req, res, next) => {
    const { error, value } = schema.validate(req[key], {
        abortEarly: false,
        stripUnknown: true
    })

    if (error) {
        return next(new AppError(error.details.map((detail) => detail.message).join(', '), 400))
    }

    // Safely update req[key]. For query and params, we avoid re-assigning the whole object 
    // to prevent "Cannot set property query" errors in some Express versions/environments.
    if (key === 'body') {
        req[key] = value
    } else {
        // Clear existing keys and assign new ones from validated value
        Object.keys(req[key]).forEach(k => delete req[key][k])
        Object.assign(req[key], value)
    }
    next()
}

export const validateBody = (schema) => validateRequestPart(schema, 'body')
export const validateQuery = (schema) => validateRequestPart(schema, 'query')
export const validateParams = (schema) => validateRequestPart(schema, 'params')
