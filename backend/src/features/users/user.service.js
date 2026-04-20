import bcrypt from 'bcrypt'
import AppError from '../../utils/appError.js'
import User from '../auth/auth.model.js'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50
const ALLOWED_SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'name', 'email', 'username', 'role', 'provider'])

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const parsePositiveNumber = (value, fallback) => {
    const parsedValue = Number.parseInt(value, 10)

    if (Number.isNaN(parsedValue) || parsedValue < 1) {
        return fallback
    }

    return parsedValue
}

const buildSafeUser = (user) => ({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    provider: user.provider,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
})

const buildUserFilters = (query) => {
    const filters = {}

    if (query.role) {
        filters.role = query.role
    }

    if (query.provider) {
        filters.provider = query.provider
    }

    if (query.name) {
        filters.name = { $regex: escapeRegex(query.name), $options: 'i' }
    }

    if (query.username) {
        filters.username = { $regex: escapeRegex(query.username), $options: 'i' }
    }

    if (query.email) {
        filters.email = { $regex: escapeRegex(query.email), $options: 'i' }
    }

    if (query.search) {
        const searchRegex = { $regex: escapeRegex(query.search), $options: 'i' }
        filters.$or = [
            { name: searchRegex },
            { username: searchRegex },
            { email: searchRegex }
        ]
    }

    if (query.createdFrom || query.createdTo) {
        filters.createdAt = {}

        if (query.createdFrom) {
            filters.createdAt.$gte = new Date(query.createdFrom)
        }

        if (query.createdTo) {
            filters.createdAt.$lte = new Date(query.createdTo)
        }
    }

    return filters
}

const buildPaginationMeta = ({ totalUsers, page, limit }) => ({
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit) || 1,
    currentPage: page,
    limit,
    hasNextPage: page * limit < totalUsers,
    hasPreviousPage: page > 1
})

const findUserById = async (userId) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new AppError('User not found', 404)
    }

    return user
}

const ensureUniqueUserFields = async ({ email, username }, excludedUserId = null) => {
    const duplicateConditions = []

    if (email) {
        duplicateConditions.push({ email })
    }

    if (username) {
        duplicateConditions.push({ username })
    }

    if (duplicateConditions.length === 0) {
        return
    }

    const existingUser = await User.findOne({
        $or: duplicateConditions,
        ...(excludedUserId ? { _id: { $ne: excludedUserId } } : {})
    })

    if (!existingUser) {
        return
    }

    if (email && existingUser.email === email) {
        throw new AppError('Email already exists', 409)
    }

    if (username && existingUser.username === username) {
        throw new AppError('Username already exists', 409)
    }
}

export const getUsersService = async (query) => {
    const page = parsePositiveNumber(query.page, DEFAULT_PAGE)
    const limit = Math.min(parsePositiveNumber(query.limit, DEFAULT_LIMIT), MAX_LIMIT)
    const sortBy = ALLOWED_SORT_FIELDS.has(query.sortBy) ? query.sortBy : 'createdAt'
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1
    const filters = buildUserFilters(query)
    const skip = (page - 1) * limit

    const [users, totalUsers] = await Promise.all([
        User.find(filters)
            .select('_id name username email role provider createdAt updatedAt')
            .sort({ [sortBy]: sortOrder, _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(filters)
    ])

    return {
        users: users.map(buildSafeUser),
        pagination: buildPaginationMeta({ totalUsers, page, limit }),
        appliedFilters: {
            role: query.role || null,
            provider: query.provider || null,
            name: query.name || null,
            username: query.username || null,
            email: query.email || null,
            search: query.search || null,
            sortBy,
            sortOrder: sortOrder === 1 ? 'asc' : 'desc'
        }
    }
}

export const getUserByIdService = async (userId) => {
    const user = await findUserById(userId)
    return buildSafeUser(user)
}

export const createUserService = async (body) => {
    const normalizedEmail = body.email.toLowerCase()
    const normalizedUsername = body.username.toLowerCase()

    await ensureUniqueUserFields({
        email: normalizedEmail,
        username: normalizedUsername
    })

    const hashedPassword = await bcrypt.hash(body.password, 12)

    const user = await User.create({
        name: body.name.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        role: body.role,
        provider: body.provider
    })

    return buildSafeUser(user)
}

export const updateUserService = async (userId, body, currentAdminId) => {
    const user = await findUserById(userId)
    const nextEmail = body.email ? body.email.toLowerCase() : undefined
    const nextUsername = body.username ? body.username.toLowerCase() : undefined

    await ensureUniqueUserFields(
        {
            email: nextEmail,
            username: nextUsername
        },
        userId
    )

    if (String(currentAdminId) === String(userId) && body.role === 'user') {
        throw new AppError('Admin users cannot downgrade their own role', 400)
    }

    if (body.name !== undefined) {
        user.name = body.name.trim()
    }

    if (nextUsername) {
        user.username = nextUsername
    }

    if (nextEmail) {
        user.email = nextEmail
    }

    if (body.role) {
        user.role = body.role
    }

    if (body.provider) {
        user.provider = body.provider
    }

    if (body.password) {
        user.password = await bcrypt.hash(body.password, 12)
    }

    await user.save()

    return buildSafeUser(user)
}

export const deleteUserService = async (userId, currentAdminId) => {
    if (String(userId) === String(currentAdminId)) {
        throw new AppError('Admin users cannot delete their own account', 400)
    }

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
        throw new AppError('User not found', 404)
    }

    return buildSafeUser(deletedUser)
}
