import { Router } from 'express'
import { getMe, login, logout, refreshSession, register, updateMe } from './auth.controller.js'
import { authLoginValidation, authRegisterValidation } from './auth.validation.js'
import { protectRouteAccess, validateBody } from './auth.middleware.js'

const router = Router()

router.post('/register', validateBody(authRegisterValidation), register)
router.post('/login', validateBody(authLoginValidation), login)
router.post('/refresh', refreshSession)
router.post('/logout', logout)
router.get('/me', protectRouteAccess, getMe)
router.patch('/me', protectRouteAccess, updateMe)

export default router
