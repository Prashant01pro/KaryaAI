import { catchAsync } from '../../utils/catchAsync.js'
import {
    createUserService,
    deleteUserService,
    getUserByIdService,
    getUsersService,
    updateUserService
} from './user.service.js'

export const getUsers = catchAsync(async (req, res) => {
    const userData = await getUsersService(req.query)

    res.status(200).json({
        status: 'success',
        results: userData.users.length,
        pagination: userData.pagination,
        filters: userData.appliedFilters,
        data: {
            users: userData.users
        }
    })
})

export const getUserById = catchAsync(async (req, res) => {
    const user = await getUserByIdService(req.params.userId)

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

export const createUser = catchAsync(async (req, res) => {
    const user = await createUserService(req.body)

    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            user
        }
    })
})

export const updateUser = catchAsync(async (req, res) => {
    const user = await updateUserService(req.params.userId, req.body, req.user._id)

    res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: {
            user
        }
    })
})

export const deleteUser = catchAsync(async (req, res) => {
    const user = await deleteUserService(req.params.userId, req.user._id)

    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
        data: {
            userId: user.id
        }
    })
})
