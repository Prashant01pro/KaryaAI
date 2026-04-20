import {
    ACCESS_TOKEN_COOKIE_MAX_AGE,
    REFRESH_TOKEN_COOKIE_MAX_AGE,
    loginService,
    logoutService,
    refreshSessionService,
    registerService,
    updateMeService
} from './auth.service.js'
import { catchAsync } from '../../utils/catchAsync.js'

const isProduction = process.env.NODE_ENV === 'production'

const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE
}

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE
}

const clearCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax'
}

const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, accessCookieOptions)
    res.cookie('refreshToken', refreshToken, refreshCookieOptions)
}

const clearAuthCookies = (res) => {
    res.clearCookie('accessToken', clearCookieOptions)
    res.clearCookie('refreshToken', clearCookieOptions)
}

export const register = catchAsync(async (req, res) => {
    const { accessToken, refreshToken, user } = await registerService(req.body)
    setAuthCookies(res, accessToken, refreshToken)

    res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        accessToken,
        user
    })
})

export const login = catchAsync(async (req, res) => {
    const { accessToken, refreshToken, user } = await loginService(req.body)
    setAuthCookies(res, accessToken, refreshToken)

    res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        accessToken,
        user
    })
})

export const refreshSession = catchAsync(async (req, res) => {
    const { accessToken, refreshToken, user } = await refreshSessionService(req.cookies.refreshToken)
    setAuthCookies(res, accessToken, refreshToken)

    res.status(200).json({
        status: 'success',
        message: 'Session refreshed successfully',
        accessToken,
        user
    })
})

export const logout = catchAsync(async (req, res) => {
    await logoutService(req.cookies.refreshToken)
    clearAuthCookies(res)

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    })
})

export const getMe = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        user: req.user
    })
})

export const updateMe = catchAsync(async (req, res) => {
    const user = await updateMeService(req.user._id, req.body)

    res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        user
    })
})
