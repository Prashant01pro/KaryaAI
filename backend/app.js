import express from 'express'
import { globalErrorHandler } from './src/middlewares/error.middleware.js'

const app=express()

app.use(express.json())

app.get('/health',(req,res)=>{
    res.status(200).json({
        message:'Server is Running'
    })
})

app.use(globalErrorHandler)

export default app;