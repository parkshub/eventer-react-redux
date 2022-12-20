const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter title"]
      },
    imageUrl: {
        type: String,
        require: [true, "Please input an image"],
    },
    cloudinaryId: {
        type: String,
        require: [true, "Please input an image"],
    },
    caption: {
        type: String,
        required: [true, "Please enter caption"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
    },
    attending: {
        type: Number,
        required: true,
        default: 1,
    },
    attendee: {
        // type: String
    },
    dateTime: {
        type: String,
        required: true,
    },
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
});

module.exports = mongoose.model("Event", eventSchema)