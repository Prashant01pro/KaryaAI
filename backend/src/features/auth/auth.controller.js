import { registerService } from './auth.service.js'
import { catchAsync } from '../../utils/catchAsync.js'

export const register = catchAsync(async (req, res) => {

    const body = req.body

    const user=await registerService(body);

    res.status(201).json({
        user:user
    })
})