
const db = require("../config/db");

// Get all orders with user details
exports.getOrders = (req, res) => {
    const sql = `
        SELECT orders.id, orders.user_id, users.name AS user_name,
               orders.product_name, orders.amount, orders.created_at
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
};

// Get order by ID
exports.getOrderById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT orders.id, orders.user_id, users.name AS user_name,
               orders.product_name, orders.amount, orders.created_at
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
        WHERE orders.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(results[0]);
    });
};

// Create order
exports.createOrder = (req, res) => {
    const { user_id, product_name, amount } = req.body;

    if (
        !Number.isInteger(Number(user_id)) ||
        Number(user_id) <= 0 ||
        user_id === "" ||
        user_id === undefined ||
        !product_name?.trim() ||
        amount === "" ||
        amount === null ||
        amount === undefined ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0
    ) {
        return res.status(400).json({
            message: "Valid user_id, product_name and positive amount are required"
        });
    }

    const sql = `
        INSERT INTO orders (user_id, product_name, amount)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [Number(user_id), product_name.trim(), Number(amount)],
        (err, result) => {
            if (err) {
                if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    return res.status(400).json({
                        message: "User does not exist"
                    });
                }

                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Order created successfully",
                id: result.insertId,
                user_id: Number(user_id),
                product_name: product_name.trim(),
                amount: Number(amount)
            });
        }
    );
};

// Update order
exports.updateOrder = (req, res) => {
    const { id } = req.params;
    const { user_id, product_name, amount } = req.body;

    if (
        !Number.isInteger(Number(user_id)) ||
        Number(user_id) <= 0 ||
        user_id === "" ||
        user_id === undefined ||
        !product_name?.trim() ||
        amount === "" ||
        amount === null ||
        amount === undefined ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0
    ) {
        return res.status(400).json({
            message: "Valid user_id, product_name and positive amount are required"
        });
    }

    const sql = `
        UPDATE orders
        SET user_id = ?, product_name = ?, amount = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [Number(user_id), product_name.trim(), Number(amount), id],
        (err, result) => {
            if (err) {
                if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    return res.status(400).json({
                        message: "User does not exist"
                    });
                }

                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Order not found" });
            }

            res.json({ message: "Order updated successfully" });
        }
    );
};

// Delete order
exports.deleteOrder = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM orders WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order deleted successfully" });
    });
};
