const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) =>{
    let error = {...err}
    error.message = err.message;
    // Log to console for the developer
    console.log((err));

    // Mongoose bad object id
    if(err.name === "CastError"){
        const message = `Resource not found `;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Duplicate key error
    if(err.code === 11000){
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    // Mongoose Validation errors
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(val =>
            val.message
        );

        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success : false,
        error : error.message || "Server Error"
    });
}

module.exports = errorHandler;