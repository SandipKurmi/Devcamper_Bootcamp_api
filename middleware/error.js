const ErrorResponse =  require('../utile/errorResponse')

const errorHandler = (err, req , res , next) => {
    const error = { ...err }
    error.message = err.message;
    // log to console for dev
    console.log(err.stack.red)

    // console.log(err.name)
    if(err.name === "CastError"){
        console.log(err.name === "CastError")
        const message = `Bootcamp not found with id of ${err.value}`;
        console.log(message);
        error = new ErrorResponse(message, 500);
        console.log(error);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "server Error "
    })

}

module.exports = errorHandler