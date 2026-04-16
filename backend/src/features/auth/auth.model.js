import mongoose from 'mongoose'

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
        }
    },
    { timestamps: true }
)

// New To Old indexing for sorting and filterig i.e Decreasing Order
userSchema.index({ createdAt: -1 })


export default mongoose.model('User', userSchema)


// min and max are for NUMBERS, not STRINGS
//unique: true -> It creates a unique index in MongoDB