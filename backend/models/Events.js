const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
    },
    title: {
        type: String,
        required: [true, "Please enter title"]
    },
    caption: {
        type: String,
        required: [true, "Please enter caption"]
    },
    description: {
        type: String,
        required: true,
    },
    dateTime: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        require: [true, "Please input an image"],
    },
    cloudinaryId: {
        type: String,
        require: [true, "Please input an image"],
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
    }
});

module.exports = mongoose.model("Event", eventSchema)