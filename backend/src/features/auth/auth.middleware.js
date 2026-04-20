import jwt from 'jsonwebtoken'
import AppError from '../../utils/appError.js'
import User from './auth.model.js'

export const validateBody = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    })

    if (error) {
        return next(new AppError(error.details.map((detail) => detail.message).join(', '), 400))
    }

    req.body = value
    next()
}

const getAccessTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization

    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.split(' ')[1]
    }

    return req.cookies.accessToken
}

export const protectRouteAccess = async (req, res, next) => {
    const token = getAccessTokenFromRequest(req)

    if (!token) {
        return next(new AppError('Authentication required', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const user = await User.findById(decoded.userId).select('_id name email username role provider')

        if (!user) {
            return next(new AppError('User not found', 401))
        }

        req.user = user
        req.auth = { sessionId: decoded.sessionId }
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new AppError('Invalid or expired access token', 401))
        }

        next(error)
    }
}

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Authentication required', 401))
    }

    if (!allowedRoles.includes(req.user.role)) {
        return next(new AppError('You are not authorized to perform this action', 403))
    }

    next()
}
