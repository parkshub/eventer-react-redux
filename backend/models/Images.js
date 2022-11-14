const mongoose = require('mongoose')

const Image = new mongoose.Schema({
    public_id: String,
    url: String,
})

module.exports = mongoose.model('Image', Image)