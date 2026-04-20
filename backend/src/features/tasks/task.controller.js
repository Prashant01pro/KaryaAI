import { catchAsync } from '../../utils/catchAsync.js'
import {
    createTaskService,
    deleteTaskService,
    getTaskByIdService,
    getTasksService,
    updateTaskService
} from './task.service.js'

export const getTasks = catchAsync(async (req, res) => {
    const taskData = await getTasksService(req.query, req.user._id)

    res.status(200).json({
        status: 'success',
        results: taskData.tasks.length,
        pagination: taskData.pagination,
        filters: taskData.appliedFilters,
        data: {
            tasks: taskData.tasks
        }
    })
})

export const getTaskById = catchAsync(async (req, res) => {
    const task = await getTaskByIdService(req.params.taskId, req.user._id)

    res.status(200).json({
        status: 'success',
        data: {
            task
        }
    })
})

export const createTask = catchAsync(async (req, res) => {
    const newTask = await createTaskService(req.body, req.user._id)

    res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        data: {
            task: newTask
        }
    })
})

export const updateTask = catchAsync(async (req, res) => {
    const updatedTask = await updateTaskService(req.params.taskId, req.body, req.user._id)

    res.status(200).json({
        status: 'success',
        message: 'Task updated successfully',
        data: {
            task: updatedTask
        }
    })
})

export const deleteTask = catchAsync(async (req, res) => {
    const deletedTask = await deleteTaskService(req.params.taskId, req.user._id)

    res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully',
        data: {
            taskId: deletedTask._id
        }
    })
})
