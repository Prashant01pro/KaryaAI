import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import AppError from '../../utils/appError.js'
import User from './auth.model.js'

export const ACCESS_TOKEN_COOKIE_MAX_AGE = 15 * 60 * 1000
export const REFRESH_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex')
}

const generateRefreshToken = (userId, sessionId) => {
    return jwt.sign(
        { userId, sessionId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    )
}

const generateAccessToken = (userId, sessionId) => {
    return jwt.sign(
        { userId, sessionId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
    )
}

const getSessionExpiryDate = () => {
    return new Date(Date.now() + REFRESH_TOKEN_COOKIE_MAX_AGE)
}

const buildSafeUser = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        provider: user.provider
    }
}

const cleanupExpiredSessions = (user) => {
    const now = new Date()
    user.sessions = user.sessions.filter((session) => session.expiresAt > now)
}

const issueSessionTokens = async (user) => {
    cleanupExpiredSessions(user)

    const sessionId = generateSessionId()
    const refreshToken = generateRefreshToken(user._id, sessionId)
    const accessToken = generateAccessToken(user._id, sessionId)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12)

    user.sessions.push({
        sessionId,
        refreshToken: hashedRefreshToken,
        expiresAt: getSessionExpiryDate()
    })

    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

export const registerService = async (body) => {
    const { name, username, email, password } = body
    const normalizedEmail = email.toLowerCase()
    const normalizedUsername = username.toLowerCase()

    const existingUser = await User.findOne({
        $or: [
            { email: normalizedEmail },
            { username: normalizedUsername }
        ]
    })

    if (existingUser) {
        if (existingUser.email === normalizedEmail) {
            throw new AppError('Email already exists', 409)
        }

        if (existingUser.username === normalizedUsername) {
            throw new AppError('Username already exists', 409)
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            name: name.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user',
            provider: 'local'
        })

        const { accessToken, refreshToken } = await issueSessionTokens(user)

        return {
            accessToken,
            refreshToken,
            user: buildSafeUser(user)
        }
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError('Email or username already exists', 409)
        }

        throw error
    }
}

export const loginService = async (body) => {
    const { email, password } = body
    const normalizedEmail = email.toLowerCase()
    const user = await User.findOne({ email: normalizedEmail }).select('+password')

    if (!user) {
        throw new AppError('Invalid email or password', 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401)
    }

    const { accessToken, refreshToken } = await issueSessionTokens(user)

    return {
        accessToken,
        refreshToken,
        user: buildSafeUser(user)
    }
}

export const refreshSessionService = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError('Refresh token required', 401)
    }

    let decoded

    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
        throw new AppError('Invalid or expired refresh token', 401)
    }

    const user = await User.findById(decoded.userId)

    if (!user) {
        throw new AppError('User not found', 401)
    }

    cleanupExpiredSessions(user)

    const session = user.sessions.find((item) => item.sessionId === decoded.sessionId)

    if (!session) {
        await user.save({ validateBeforeSave: false })
        throw new AppError('Invalid or expired refresh token', 401)
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, session.refreshToken)

    if (!isRefreshTokenValid) {
        user.sessions = user.sessions.filter((item) => item.sessionId !== decoded.sessionId)
        await user.save({ validateBeforeSave: false })
        throw new AppError('Invalid or expired refresh token', 401)
    }

    user.sessions = user.sessions.filter((item) => item.sessionId !== decoded.sessionId)
    const { accessToken, refreshToken: rotatedRefreshToken } = await issueSessionTokens(user)

    return {
        accessToken,
        refreshToken: rotatedRefreshToken,
        user: buildSafeUser(user)
    }
}

export const logoutService = async (refreshToken) => {
    if (!refreshToken) {
        return
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
            ignoreExpiration: true
        })
        const user = await User.findById(decoded.userId)

        if (!user) {
            return
        }

        user.sessions = user.sessions.filter((session) => session.sessionId !== decoded.sessionId)
        await user.save({ validateBeforeSave: false })
    } catch (error) {
        return
    }
}
