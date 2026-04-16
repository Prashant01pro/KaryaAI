import express from 'express'
import { globalErrorHandler } from './src/middlewares/error.middleware.js'
// import * as authRoute from './src/features/auth/auth.route.js'  // Gives Object
import authRoute from './src/features/auth/auth.route.js'

const app=express()

app.use(express.json())

app.use(authRoute);

app.get('/health',(req,res)=>{
    res.status(200).json({
        message:'Server is Running'
    })
})

app.use(globalErrorHandler)

export default app;