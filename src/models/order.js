const mongoose = require("mongoose");

const factorySchema = new mongoose.Schema({
    name: String,
    category: String,
    email: String,
    phone: String,
    createdAt: Date,
})  

const shipperSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    createdAt: Date,
})  

const orderSchema = new mongoose.Schema({
    item_title: String,
    item_description: String,
    quantity: Number,
    order_date: Date,
    address: String,
    price: Number,
    status: String,
    createdAt: Date,
    factory: [factorySchema],
    shipper: [shipperSchema],
})  

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;