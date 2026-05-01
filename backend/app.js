import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import { globalErrorHandler } from './src/middlewares/error.middleware.js'

import authRoute from './src/features/auth/auth.route.js'
import taskRoute from './src/features/tasks/task.route.js'

import aiRoute from './src/features/ai/ai.route.js'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import configurePassport from './src/config/passport.js'
import { socialAuthSuccess } from './src/features/auth/auth.controller.js'

const app=express()

// 1. Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https://*", "http://*"],
            connectSrc: ["'self'", "https://api.github.com", "https://*.google.com", "https://*.google-analytics.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}))

// 2. Trust Proxy for Railway/Heroku
app.set('trust proxy', 1)

// 3. Dynamic CORS
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// 4. Body Parsers & Sanitization
app.use(express.json({ limit: '10kb' })) // Body limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Fix for Express 5.x: req.query is a getter by default, which breaks mongoSanitize and hpp
app.use((req, res, next) => {
    let query = req.query;
    Object.defineProperty(req, 'query', {
        get: () => query,
        set: (val) => { query = val; },
        enumerable: true,
        configurable: true
    });
    next();
});

app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(hpp())

// 5. Global Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
})
app.use('/api', globalLimiter)

// 6. Targeted Rate Limiting for Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 auth requests per 15 minutes
    message: 'Too many authentication attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(cookieParser())
configurePassport()
app.use(passport.initialize())

app.use('/api/v1/auth', authLimiter, authRoute);
app.use('/api/v1/tasks',taskRoute);

// Root level OAuth callbacks (matching user's authorized redirect URLs)
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }), socialAuthSuccess)
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }), socialAuthSuccess)

app.use('/api/v1/ai',aiRoute);

app.get('/health',(req,res)=>{
    res.status(200).json({
        message:'Server is Running'
    })
})

app.use(globalErrorHandler)

export default app;
