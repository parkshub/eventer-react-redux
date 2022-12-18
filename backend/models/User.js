const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {        
        firstName: {
            type: String,
            required: [true, 'Please add name']
        },
        lastName: {
            type: String,
            required: [true, 'Please add name']
        },
        email: {
            type: String,
            required: [true, 'Please add email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please add password']
        },
        image: {
            type: String,
            required: [true, 'Please add hex or image']
        },
        cloudinaryId: {
            type: String,
        },
        attending: {
            type: [String],
            default: []
        }
    }
)

module.exports = mongoose.model('User', UserSchema)