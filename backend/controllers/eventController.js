// const UserModel = require('../models/User')
const EventModel = require('../models/Events')
const asyncHandler = require('express-async-handler')
// ** just a reminder we just asynchandler because async can't deal with throw new Error

exports.createEvent = asyncHandler(async(req, res) => {
    
    const event = await EventModel.create({
        title: req.body.title,
        caption: req.body.caption,
        user: req.user.id
    })

    res.status(200).json(event)
})

exports.getUserEvents = asyncHandler(async(req, res) => {
    const events = await EventModel.find({user: req.user.id})
    res.status(200).json(events)
})

exports.deleteEvent = asyncHandler(async(req, res) => {
    
    const event = await EventModel.findById(req.params.id)

    await checkUser(req, event)

    await event.deleteOne()

    res.status(200).json(event.id)
})

exports.updateEvent = asyncHandler(async(req, res) => {
    
    const findEvent = await EventModel.findById(req.params.id)

    await checkUser(req, findEvent)
    console.log(req.user)
    const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedEvent)
  // ** would be cool if I could find a way to only send the updated portions of the doc
})

function checkUser(req, doc) {

    if (req.user.id !== String(doc.user)) {
        res.status(401)
        throw new Error('Unauthorized user')
    }
}