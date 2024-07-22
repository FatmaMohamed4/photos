const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    photo: String
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
