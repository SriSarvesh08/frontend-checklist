
require("dotenv").config();

const express = require("express");
const db = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Users and Orders API is running!"
    });
});

// Database connection test
app.get("/db-test", (req, res) => {
    db.query("SELECT 1 AS result", (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database query failed"
            });
        }

        res.json({
            message: "Database query successful!",
            result: results[0].result
        });
    });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Unknown route
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err.message);

    res.status(500).json({
        message: "Internal server error"
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
