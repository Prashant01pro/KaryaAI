import Joi from 'joi'
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from './task.model.js'

const objectId = Joi.string().hex().length(24)

const taskBodyShape = {
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().allow('').max(500),
    priority: Joi.string().valid(...TASK_PRIORITIES),
    status: Joi.string().valid(...TASK_STATUSES),
    category: Joi.string().valid(...TASK_CATEGORIES),
    dueDate: Joi.date().iso().min('now').allow(null)
}

export const createTaskValidation = Joi.object({
    title: taskBodyShape.title.required(),
    description: taskBodyShape.description.default(''),
    priority: taskBodyShape.priority.default('Moderate'),
    status: taskBodyShape.status.default('Pending'),
    category: taskBodyShape.category.required(),
    dueDate: taskBodyShape.dueDate.optional()
})

export const updateTaskValidation = Joi.object({
    title: taskBodyShape.title,
    description: taskBodyShape.description,
    priority: taskBodyShape.priority,
    status: taskBodyShape.status,
    category: taskBodyShape.category,
    dueDate: taskBodyShape.dueDate
}).min(1)

export const taskIdValidation = Joi.object({
    taskId: objectId.required()
})

export const taskQueryValidation = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    category: Joi.string().trim().allow(''),
    priority: Joi.string().trim().allow(''),
    status: Joi.string().trim().allow(''),
    name: Joi.string().trim().max(100).allow(''),
    search: Joi.string().trim().max(100).allow(''),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'dueDate', 'title', 'priority', 'status', 'category').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    dueDateFrom: Joi.date().iso(),
    dueDateTo: Joi.date().iso().min(Joi.ref('dueDateFrom'))
})
