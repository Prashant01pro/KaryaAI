import Task from './task.model.js'
import AppError from '../../utils/appError.js'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50
const ALLOWED_SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'dueDate', 'title', 'priority', 'status', 'category'])

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const parsePositiveNumber = (value, fallback) => {
    const parsedValue = Number.parseInt(value, 10)

    if (Number.isNaN(parsedValue) || parsedValue < 1) {
        return fallback
    }

    return parsedValue
}

const parseListFilter = (value) => {
    if (!value) {
        return []
    }

    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

const buildTaskFilters = (query, userId) => {
    const filters = {
        userId,
        isDeleted: false
    }

    const categories = parseListFilter(query.category)
    const priorities = parseListFilter(query.priority)
    const statuses = parseListFilter(query.status)

    if (categories.length > 0) {
        filters.category = { $in: categories }
    }

    if (priorities.length > 0) {
        filters.priority = { $in: priorities }
    }

    if (statuses.length > 0) {
        filters.status = { $in: statuses }
    }

    if (query.name) {
        filters.title = { $regex: escapeRegex(query.name), $options: 'i' }
    }

    if (query.search) {
        const searchRegex = { $regex: escapeRegex(query.search), $options: 'i' }
        filters.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { category: searchRegex }
        ]
    }

    if (query.dueDateFrom || query.dueDateTo) {
        filters.dueDate = {}

        if (query.dueDateFrom) {
            filters.dueDate.$gte = new Date(query.dueDateFrom)
        }

        if (query.dueDateTo) {
            filters.dueDate.$lte = new Date(query.dueDateTo)
        }
    }

    return filters
}

const buildPaginationMeta = ({ totalTasks, page, limit }) => ({
    totalTasks,
    totalPages: Math.ceil(totalTasks / limit) || 1,
    currentPage: page,
    limit,
    hasNextPage: page * limit < totalTasks,
    hasPreviousPage: page > 1
})

const findOwnedTaskById = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, userId, isDeleted: false })

    if (!task) {
        throw new AppError('Task not found', 404)
    }

    return task
}

export const getTasksService = async (query, userId) => {
    const page = parsePositiveNumber(query.page, DEFAULT_PAGE)
    const limit = Math.min(parsePositiveNumber(query.limit, DEFAULT_LIMIT), MAX_LIMIT)
    const sortBy = ALLOWED_SORT_FIELDS.has(query.sortBy) ? query.sortBy : 'createdAt'
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1
    const filters = buildTaskFilters(query, userId)
    const skip = (page - 1) * limit

    const [tasks, totalTasks] = await Promise.all([
        Task.find(filters)
            .sort({ [sortBy]: sortOrder, _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Task.countDocuments(filters)
    ])

    return {
        tasks,
        pagination: buildPaginationMeta({ totalTasks, page, limit }),
        appliedFilters: {
            category: parseListFilter(query.category),
            priority: parseListFilter(query.priority),
            status: parseListFilter(query.status),
            name: query.name || null,
            search: query.search || null,
            sortBy,
            sortOrder: sortOrder === 1 ? 'asc' : 'desc'
        }
    }
}

export const getTaskByIdService = async (taskId, userId) => findOwnedTaskById(taskId, userId)

export const createTaskService = async (body, userId) => {
    const newTask = await Task.create({
        userId,
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        category: body.category,
        dueDate: body.dueDate || null
    })

    return newTask
}

export const updateTaskService = async (taskId, body, userId) => {
    await findOwnedTaskById(taskId, userId)

    if (body.status === 'Completed') {
        body.aiStrategy = null
    }

    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId, isDeleted: false },
        body,
        {
            returnDocument: 'after',
            runValidators: true
        }
    )

    return updatedTask
}

export const deleteTaskService = async (taskId, userId) => {
    const deletedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId, isDeleted: false },
        {
            isDeleted: true,
            deletedAt: new Date()
        },
        {
            returnDocument: 'after'
        }
    )

    if (!deletedTask) {
        throw new AppError('Task not found', 404)
    }

    return deletedTask
}
