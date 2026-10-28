function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || err.statusCode || 500;

    if (statusCode >= 500) {
        console.error(err);
    }

    const message =
        statusCode >= 500
            ? "Internal server error"
            : err.type === "entity.parse.failed"
                ? "Invalid JSON format"
                : err.message;

    res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = errorHandler;