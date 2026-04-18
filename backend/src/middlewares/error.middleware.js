export const globalErrorHandler = (err, req, res, next) => {
    console.error(err)

    const statusCode = err.statusCode || 500
    const status = err.status || (`${statusCode}`.startsWith('4') ? 'fail' : 'error')

    res.status(statusCode).json({
        status,
        message: err.message || 'Something went wrong'
    })
}
