const mongoose = require("mongoose");

const shipperSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    createdAt: Date,
})  

const Shipper = mongoose.model('Shipper', shipperSchema);

module.exports = Shipper;