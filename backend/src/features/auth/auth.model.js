import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    { _id: false }
)

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 20,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        provider: {
            type: String,
            enum: ['local', 'google', 'github'],
            default: 'local'
        },
        sessions: {
            type: [sessionSchema],
            default: []
        }
    },
    { timestamps: true }
)

userSchema.index({ createdAt: -1 })

export default mongoose.model('User', userSchema)
