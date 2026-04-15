export const globalErrorHandler=(err,req,res,next)=>{
    console.error(err.message)

    res.status(err.status).json({
        message:err.message
    })
}