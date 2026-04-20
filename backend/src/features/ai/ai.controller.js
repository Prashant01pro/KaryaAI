import { catchAsync } from '../../utils/catchAsync.js'
import { aiService } from './ai.service.js'
import { getTaskByIdService, updateTaskService } from '../tasks/task.service.js'

export const generateTaskStrategy = catchAsync(async (req, res) => {
    const { taskId } = req.params
    const userId = req.user._id

    // 1. Fetch task details
    const task = await getTaskByIdService(taskId, userId)

    // 2. Generate strategy using AI service
    const strategy = await aiService.generateStrategy(task)

    // 3. Save strategy to task document
    await updateTaskService(taskId, { aiStrategy: strategy }, userId)

    res.status(200).json({
        status: 'success',
        data: {
            taskId,
            strategy
        }
    })
})
