const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter title']
      },
    //   image: {
    //     type: String,
    //     require: true,
    //   },
    //   cloudinaryId: {
    //     type: String,
    //     require: true,
    //   },
    caption: {
        type: String,
        required: [true, 'Please enter caption']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
    // attending: {
    //     type: Number,
    //     required: true,
    // },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },
    // dateTime: {
    //     type: String,
    //     required: true,
    // },
    // description: {
    //     type: String,
    //     required: true,
    // },
    // country: {
    //     type: String,
    //     required: true
    // },
    // state: {
    //     type: String,
    //     required: true
    // },
    // city: {
    //     type: String,
    //     required: true
    // },
    // street: {
    //     type: String,
    //     required: true
    // },
    // attendee: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     default: []
    // }
});

module.exports = mongoose.model('Event', eventSchema)