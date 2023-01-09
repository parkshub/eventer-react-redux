const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
    },
    title: {
        type: String,
        required: [true, "Please enter a title"]
    },
    caption: {
        type: String,
        required: [true, "Please enter a caption"]
    },
    description: {
        type: String,
        required: [true, "Please enter a description"]
    },
    dateTime: {
        type: String,
        required: [true, "Please choose a data and time"]
    },
    street: {
        type: String,
        required: [true, "Please enter the street address"]
    },
    city: {
        type: String,
        required: [true, "Please enter a city"]
    },
    imageUrl: {
        type: String,
        require: [true, "Please choose an image"],
    },
    cloudinaryId: {
        type: String,
        require: [true, "Please choose an image"],
    },
    attending: {
        type: Number,
        required: true,
        default: 1,
    },
    attendee: {
        // type: String
    },
    maxAttendee: {
        type: Number,
        required: [true, "Please input maximum attendee"]
    },
    test: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
});

module.exports = mongoose.model("Event", eventSchema)