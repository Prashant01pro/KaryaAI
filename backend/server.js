import dotenv from 'dotenv'
import app from './app.js'
import connectDB from './src/config/db.js'

dotenv.config()

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
    console.error(err.name, err.message)
    process.exit(1)
})

const PORT = process.env.PORT || 4000

let server;
const startServer = async () => {
    await connectDB()

    server = app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`)
    })
}

startServer().catch((error) => {
    console.error('Failed to start server', error)
    process.exit(1)
})

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...')
    console.error(err.name, err.message)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
})
