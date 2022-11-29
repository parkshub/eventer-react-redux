const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        name: {
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
        attending: {
        }
    }
)

module.exports = mongoose.model('User', UserSchema)