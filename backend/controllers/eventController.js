const UserModel = require('../models/User')
const EventModel = require('../models/Events')
const cloudinary = require('../config/cloudinary')

exports.createEvent = async(req, res) => {
    const image = req.body.selectedFile

    const imageResponse = await cloudinary.uploader.upload(image, {
        folder: "userImage",
        transformation: [
            {height: 500, width: 500, crop: "scale"}
        ]
    })
        
    const event = await EventModel.create({
        user: req.user.id,
        userName: req.user.firstName + ' ' + req.user.lastName,
        title: req.body.formData.title,
        caption: req.body.formData.caption,
        description: req.body.formData.description,
        dateTime: req.body.formData.dateTime,
        street: req.body.formData.street,
        city: req.body.formData.city,
        attendee: 
        [{
            [req.user.id]: 
                {
                    name: req.user.firstName + ' ' + req.user.lastName,
                    image: req.user.image
                }
        }],
        imageUrl: imageResponse.secure_url,
        cloudinaryId: imageResponse.public_id,
        maxAttendee: req.body.formData.maxAttendee
    })
    res.status(200).json(event)
}

exports.getHomeEvents = async(req, res) => {
    try {
        const events = await EventModel.find().sort({attending: -1}).limit(4)
        res.json(events)   
    } catch (error) {
        res.status(500).send('Something went wrong. Could not load main page events')
    }
}

exports.getEvent = async(req, res) => {
    const events = await EventModel.findById(req.params.id)
    res.status(200).json(events)
}

exports.getAllEvents = async(req, res) => {
    const events = await EventModel.find()
    
    res.status(200).json(events)
    
}

exports.deleteEvent = async(req, res) => {    
    const event = await EventModel.findById(req.params.id)
    await checkUser(req, res, event)
    
    const attendees = event.attendee.map(x => Object.keys(x)).flat(1).filter(x => x !== req.user.id)
    
    const users = await UserModel.find({ '_id': { $in: attendees}})

    const filterEvents = async(users) => {
        for (let user of users) {
            user.attending = user.attending.filter(event => event !== req.params.id)
            await user.save()
        }
    }

    filterEvents(users)

    await cloudinary.uploader.destroy(event.cloudinaryId)

    await event.deleteOne()

    res.status(200).json(event.id)
}

exports.updateEvent = async(req, res) => {
    const event = await EventModel.findById(req.params.id)
    
    await checkUser(req, res, event)

    const image = req.body.selectedFile
    
    if (image == event.imageUrl) {
        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body.formData, {
            new: true
        })
        res.status(200).json(updatedEvent)
    } else {
        await cloudinary.uploader.destroy(event.cloudinaryId)

        const imageResponse = await cloudinary.uploader.upload(image, {
            folder: "userImage",
        })
        
        req.body.formData.imageUrl = imageResponse.secure_url
        req.body.formData.cloudinaryId = imageResponse.public_id

        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body.formData, {
            new: true
        })
        
        res.status(200).json(updatedEvent)
    }    
}


exports.attendEvent = async(req, res) => {
    const findEvent = await EventModel.findById(req.params.id)

    let attendees = findEvent.attendee.map(x => Object.keys(x)).flat(1)
    let fullName = req.user.firstName + ' ' + req.user.lastName

    const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, {
        $inc: {attending: 1},
        $push: {attendee: {[req.user.id]: {
            name: fullName,
            image: req.user.image
        }}}
    }, {
        new: true
    })

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, {
        $push: {attending: updatedEvent.id}
    })

    res.status(200).json(updatedEvent)
}

exports.unattendEvent = async(req, res) => {
    try {
        const fullName = req.user.firstName + ' ' + req.user.lastName
        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, {
            $pull: {attendee: {[req.user.id]: {
                name: fullName,
                image: req.user.image
            }}},
            $inc: {attending: -1}
        }, {
            new: true
        })

        const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, {
            $pull: {attending: updatedEvent.id}
        })

        res.status(200).json(updatedEvent)
    } catch (error) {
        res.status(500).send('something went wrong')
    }
}

exports.getAttendingEvents = async(req, res) => {
    const user = UserModel.findById(req.user.id)

    if (req.user.attending.length === 0) {
        res.json('')
    } else {
        const attendingEvents = await EventModel.find({ '_id': { $in: [req.user.attending]}})
        res.json(attendingEvents)
    }
}

exports.getUserEvents = async(req, res) => {
    const events = await EventModel.find({user: req.user.id})

    res.status(200).json(events)
}

exports.getProfileEvents = async(req, res) => {
    const user = await UserModel.findById(req.params.id)
    const userEvents = await EventModel.find({user: req.params.id})
    const attendingEvents = await EventModel.find({ '_id': { $in: user.attending}})

    res.json(
        {
            userEvents: userEvents,
            attendingEvents: attendingEvents
        })
}

function checkUser(req, res, doc) {

    if (req.user.id !== String(doc.user)) {
        res.status(401).send("Unauthorized user")
    }
}