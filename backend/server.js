import dotenv from 'dotenv'
import app from './app.js'
import connectDB from './src/config/db.js'

dotenv.config()

const PORT = process.env.PORT || 4000

const startServer = async () => {
    await connectDB()

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`)
    })
}

startServer().catch((error) => {
    console.error('Failed to start server', error)
    process.exit(1)
})
