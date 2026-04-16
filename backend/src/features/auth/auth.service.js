import User from './auth.model.js'
import AppError from '../../utils/appError.js';
import bcrypt from 'bcrypt'

export const registerService = async (body) => {
    const { name, username, email, password, role } = body;

    const normalizeEmail = email.toLowerCase()
    const normalizeUsername = username.toLowerCase()

    const existingUser = await User.findOne({
        $or: [
            { email: normalizeEmail },
            { username: normalizeUsername }
        ]
    })

    if (existingUser) {
        if (existingUser.email === normalizeEmail) {
            throw new AppError('Email Already Exist', 400)
        }
        if (existingUser.username === normalizeUsername) {
            throw new AppError('Username Already Exist', 400)
        }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    try {
        const user = await User.create({
            name: name,
            username: normalizeUsername,
            email: normalizeEmail,
            password: hashedPassword,
            role: 'user'

        })

        user.password = undefined;

        return user;

    } catch (error) {
        if (error.code === 11000) {
            throw new AppError('Email or Username Already Exist', 400)
        }
        throw error
    }


};

// In catch:
// Handle known errors
// Re-throw unknown errors