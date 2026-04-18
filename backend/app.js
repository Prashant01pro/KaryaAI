import express from 'express'
import { globalErrorHandler } from './src/middlewares/error.middleware.js'
// import * as authRoute from './src/features/auth/auth.route.js'  // Gives Object
import authRoute from './src/features/auth/auth.route.js'
import cookieParser from 'cookie-parser'

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/v1/auth',authRoute);

app.get('/health',(req,res)=>{
    res.status(200).json({
        message:'Server is Running'
    })
})

app.use(globalErrorHandler)

export default app;