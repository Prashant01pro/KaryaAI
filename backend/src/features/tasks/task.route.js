import { Router } from 'express'
import { protectRouteAccess } from '../auth/auth.middleware.js'
import {
    createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask
} from './task.controller.js'
import { validateBody, validateParams, validateQuery } from './task.middleware.js'
import {
    createTaskValidation,
    taskIdValidation,
    taskQueryValidation,
    updateTaskValidation
} from './task.validation.js'

const router = Router()

router.use(protectRouteAccess)

router
    .route('/')
    .post(validateBody(createTaskValidation), createTask)
    .get(validateQuery(taskQueryValidation), getTasks)

router
    .route('/:taskId')
    .get(validateParams(taskIdValidation), getTaskById)
    .patch(validateParams(taskIdValidation), validateBody(updateTaskValidation), updateTask)
    .delete(validateParams(taskIdValidation), deleteTask)

export default router
