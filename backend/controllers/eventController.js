// const UserModel = require('../models/User')
const EventModel = require('../models/Events')
const AttendeeModel = require('../models/Events')
const asyncHandler = require('express-async-handler')
const {cloudinary} = require('../config/cloudinary')

// ** just a reminder we just asynchandler because async can't deal with throw new Error

exports.createEvent = asyncHandler(async(req, res) => {
    
    const event = await EventModel.create({
        title: req.body.title,
        caption: req.body.caption,
        user: req.user.id,
        attendee: [{[req.user.id]: req.user.name}]
    })

    res.status(200).json(event)
})

exports.getUserEvents = asyncHandler(async(req, res) => {
    const events = await EventModel.find({user: req.user.id})
    res.status(200).json(events)
})

exports.deleteEvent = asyncHandler(async(req, res) => {
    
    const event = await EventModel.findById(req.params.id)

    await checkUser(req, res, event)

    await event.deleteOne()

    res.status(200).json(event.id)
})

exports.updateEvent = asyncHandler(async(req, res) => {
    
    const findEvent = await EventModel.findById(req.params.id)

    await checkUser(req, res, findEvent)
    console.log(req.user)
    const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedEvent)
  // ** would be cool if I could find a way to only send the updated portions of the doc
})

// exports.attendEvent = asyncHandler(async(req,res) => {
//     const attendee = await AttendeeModel.create({
//         name: req.user.name,
//         userId: req.user.id,
//         eventId: req.params.id,
//     })

//     res.json(attendee)
    
// })

exports.attendEvent = asyncHandler(async(req, res) => {
    const findEvent = await EventModel.findById(req.params.id)
    
    // checking to see if already attending
    let attendees = findEvent.attendee.map(x => Object.keys(x)).flat(1)
    if( attendees.indexOf(req.user.id) != -1) {
        throw new Error ("You're already attending this event")
    }
    
    // checking to see if maker is trying to attend
    if (req.user.id === String(findEvent.user)) {
        res.status(401)
        throw new Error ("You made this event. Can't attend")
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, {
        $inc: {attending: 1},
        $push: {attendee: {[req.user.id]: req.user.name}}
    },
    {new : true})

    res.json(updatedEvent) // might only need to send the attendee portion and attendee count, dont need rest
})

 
exports.uploadPic = asyncHandler(async(req, res) => {
    console.log('here')
    console.log(process.env.REACT_APP_API_SECRET)
    try {
        const fileStr = req.body.data;

        const uploadResponse = await cloudinary.uploader.upload(fileStr);
        console.log(uploadResponse);
        // store the public_id of cloudinary image
        res.json({ msg: 'yaya' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
}
)


function checkUser(req, res, doc) {

    if (req.user.id !== String(doc.user)) {
        res.status(401)
        throw new Error('Unauthorized user')
    }
}