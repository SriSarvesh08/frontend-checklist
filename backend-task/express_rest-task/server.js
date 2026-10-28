const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = 3000;

// Middleware to read JSON request bodies
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Task Manager API is running"
    });
});

// Task routes
app.use("/tasks", taskRoutes);

// Handle unknown routes
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

// Centralized error handler (must be after routes)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});