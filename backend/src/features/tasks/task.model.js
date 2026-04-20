import mongoose from 'mongoose'

export const TASK_PRIORITIES = ['High', 'Moderate', 'Low']
export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed']
export const TASK_CATEGORIES = ['Work', 'Personal', 'Study', 'Other']

export const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
            trim: true
        },
        description: {
            type: String,
            maxlength: 500,
            trim: true,
            default: ''
        },
        priority: {
            type: String,
            enum: TASK_PRIORITIES,
            default: 'Moderate'
        },
        status: {
            type: String,
            enum: TASK_STATUSES,
            default: 'Pending',
            required: true
        },
        category: {
            type: String,
            enum: TASK_CATEGORIES,
            required: true,
            default: 'Other'
        },
        dueDate: {
            type: Date,
            validate: {
                validator(value) {
                    if (!value) {
                        return true
                    }

                    return value >= new Date()
                },
                message: 'Due date cannot be in the past'
            }
        },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false
        },
        deletedAt: {
            type: Date,
            default: null,
            select: false
        },
        aiStrategy: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
)

taskSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 })
taskSchema.index({ userId: 1, category: 1, isDeleted: 1 })
taskSchema.index({ userId: 1, status: 1, isDeleted: 1 })
taskSchema.index({ userId: 1, priority: 1, isDeleted: 1 })
taskSchema.index({ userId: 1, title: 1, isDeleted: 1 })

export default mongoose.model('Task', taskSchema)
