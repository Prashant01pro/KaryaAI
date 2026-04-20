import { Router } from 'express'
import { protectRouteAccess } from '../auth/auth.middleware.js'
import { generateTaskStrategy } from './ai.controller.js'

const router = Router()

// All AI routes require authentication
router.use(protectRouteAccess)

router.post('/generate-strategy/:taskId', generateTaskStrategy)

export default router
