require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Parse incoming JSON
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Products API is running"
    });
});

// Database connection test
app.get("/db-test", (req, res) => {
    const connected = mongoose.connection.readyState === 1;

    res.status(connected ? 200 : 503).json({
        success: connected,
        message: connected
            ? "MongoDB is connected"
            : "MongoDB is not connected"
    });
});

// Product CRUD routes
app.use("/api/products", productRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Central error handler
app.use((err, req, res, next) => {
    console.error(err.message);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid data format"
        });
    }

    if (err.status === 400 || err.status === 413) {
        return res.status(err.status).json({
            success: false,
            message: err.status === 413
                ? "Request body is too large"
                : "Invalid request body"
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// Connect to MongoDB before starting the server
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 3002;

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

startServer();