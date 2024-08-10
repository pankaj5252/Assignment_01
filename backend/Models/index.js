const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: {
        type: String,
        required: true,
    },
    category: String,
    dateOfSale: Date,
    sold: Boolean,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
