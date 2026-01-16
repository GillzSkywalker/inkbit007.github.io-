const errorHandler = (err, req, res, next) => {
    // 1. Log the error to your terminal so YOU can see it
    console.error("❌ Backend Error:", err.message);

    // 2. Set default status
    let statusCode = err.statusCode || 500;
    let errorMessage = err.message || 'Internal Server Error';

    // 3. Handle specific Mongoose errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = Object.values(err.errors).map(e => e.message).join(', ');
    }

    if (err.code === 11000) {
        statusCode = 400;
        errorMessage = 'Email or Username already exists.';
    }

    // 4. SEND THE RESPONSE (Crucial to prevent "Network Error")
    res.status(statusCode).json({
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;