const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const factorySchema = new mongoose.Schema({
    name: String,
    category: String,
    email: String,
    phone: String,
    createdAt: Date,
})

const Factory = mongoose.model('Factory', factorySchema);

module.exports = Factory;