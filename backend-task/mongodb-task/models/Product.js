const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [2, "Product name must contain at least 2 characters"]
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"]
        },

        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true
        },

        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Stock must be a whole number"
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);