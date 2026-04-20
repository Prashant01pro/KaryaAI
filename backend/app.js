import express from 'express'
import cors from 'cors'
import { globalErrorHandler } from './src/middlewares/error.middleware.js'
// import * as authRoute from './src/features/auth/auth.route.js'  // Gives Object
import authRoute from './src/features/auth/auth.route.js'
import taskRoute from './src/features/tasks/task.route.js'
import userRoute from './src/features/users/user.route.js'
import aiRoute from './src/features/ai/ai.route.js'
import cookieParser from 'cookie-parser'

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api/v1/auth',authRoute);
app.use('/api/v1/tasks',taskRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/ai',aiRoute);

app.get('/health',(req,res)=>{
    res.status(200).json({
        message:'Server is Running'
    })
})

app.use(globalErrorHandler)

export default app;
