import { Router } from 'express'
import { authorizeRoles, protectRouteAccess } from '../auth/auth.middleware.js'
import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser
} from './user.controller.js'
import { validateBody, validateParams, validateQuery } from './user.middleware.js'
import {
    createUserValidation,
    updateUserValidation,
    userIdValidation,
    userQueryValidation
} from './user.validation.js'

const router = Router()

router.use(protectRouteAccess, authorizeRoles('admin'))

router
    .route('/')
    .post(validateBody(createUserValidation), createUser)
    .get(validateQuery(userQueryValidation), getUsers)

router
    .route('/:userId')
    .get(validateParams(userIdValidation), getUserById)
    .patch(validateParams(userIdValidation), validateBody(updateUserValidation), updateUser)
    .delete(validateParams(userIdValidation), deleteUser)

export default router
