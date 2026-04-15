import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database is Connected")
    } catch (err) {
        console.error(err.message)
        //You should exit the process if DB fails
        process.exit(1)
    }
}

export default connectDB;