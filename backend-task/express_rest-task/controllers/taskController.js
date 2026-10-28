let tasks = [];
let nextId = 1;

// Create a new task
exports.createTask = (req, res, next) => {
    const { title, completed } = req.body;

    if (typeof title !== "string" || !title.trim()) {
        const error = new Error("Title is required");
        error.status = 400;
        return next(error);
    }

    if (completed !== undefined && typeof completed !== "boolean") {
        const error = new Error("Completed must be true or false");
        error.status = 400;
        return next(error);
    }

    const task = {
        id: nextId++,
        title: title.trim(),
        completed: completed ?? false
    };

    tasks.push(task);

    res.status(201).json({
        message: "Task created successfully",
        task
    });
};

// Get all tasks
exports.getAllTasks = (req, res) => {
    res.status(200).json(tasks);
};

// Get a task by ID
exports.getTaskById = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Invalid task ID");
        error.status = 400;
        return next(error);
    }

    const task = tasks.find(task => task.id === id);

    if (!task) {
        const error = new Error("Task not found");
        error.status = 404;
        return next(error);
    }

    res.status(200).json(task);
};

// Update a task
exports.updateTask = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Invalid task ID");
        error.status = 400;
        return next(error);
    }

    const task = tasks.find(task => task.id === id);

    if (!task) {
        const error = new Error("Task not found");
        error.status = 404;
        return next(error);
    }

    const { title, completed } = req.body;

    if (Object.keys(req.body).length === 0) {
        const error = new Error("Provide a field to update");
        error.status = 400;
        return next(error);
    }

    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            const error = new Error("Title must be a non-empty string");
            error.status = 400;
            return next(error);
        }

        task.title = title.trim();
    }

    if (completed !== undefined) {
        if (typeof completed !== "boolean") {
            const error = new Error("Completed must be true or false");
            error.status = 400;
            return next(error);
        }

        task.completed = completed;
    }

    const allowedFields = ["title", "completed"];
    const invalidFields = Object.keys(req.body).filter(
        field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        const error = new Error(
            `Invalid field(s): ${invalidFields.join(", ")}`
        );
        error.status = 400;
        return next(error);
    }

    res.status(200).json({
        message: "Task updated successfully",
        task
    });
};

// Delete a task
exports.deleteTask = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Invalid task ID");
        error.status = 400;
        return next(error);
    }

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        const error = new Error("Task not found");
        error.status = 404;
        return next(error);
    }

    tasks.splice(taskIndex, 1);

    res.status(204).end();
};