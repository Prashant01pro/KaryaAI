import { Router } from 'express'
import passport from 'passport'
import { getMe, login, logout, refreshSession, register, updateMe, socialAuthSuccess } from './auth.controller.js'
import { authLoginValidation, authRegisterValidation } from './auth.validation.js'
import { protectRouteAccess, validateBody } from './auth.middleware.js'

const router = Router()

router.post('/register', validateBody(authRegisterValidation), register)
router.post('/login', validateBody(authLoginValidation), login)
router.post('/refresh', refreshSession)
router.post('/logout', logout)
router.get('/me', protectRouteAccess, getMe)
router.patch('/me', protectRouteAccess, updateMe)

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }))

export default router
