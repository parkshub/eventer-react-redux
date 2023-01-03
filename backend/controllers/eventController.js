const UserModel = require('../models/User')
const EventModel = require('../models/Events')
const ImageModel = require('../models/Images')
const asyncHandler = require('express-async-handler')
const cloudinary = require('../config/cloudinary')
const { json } = require('express')
const User = require('../models/User')

// ** SINCE YOU'RE NOT USING THROW ERROR YOU DONT NEED ASYNC HANDLER, SLOWLY GET RID OF IT AND SEE IF ANYTHING BREAKS AFTER COMPLETION


// ** just a reminder we just asynchandler because async can't deal with throw new Error

exports.createEvent = asyncHandler(async(req, res) => {

    console.log('createEvent controller')

    const image = req.body.selectedFile

    const imageResponse = await cloudinary.uploader.upload(image, {
        folder: "userImage",
        transformation: [
            {height: 500, width: 500, crop: "scale"}
        ]
    })

    console.log('this is formData', req.body.formData)
        
    const event = await EventModel.create({
        user: req.user.id,
        userName: req.user.firstName + ' ' + req.user.lastName,
        title: req.body.formData.title,
        caption: req.body.formData.caption,
        description: req.body.formData.description,
        dateTime: req.body.formData.dateTime,
        street: req.body.formData.street,
        city: req.body.formData.city,
        // attendee: [{[req.user.id]: req.user.firstName}],
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

})

exports.getHomeEvents = asyncHandler(async(req, res) => {
    try {
        console.log('getHomeEvents controller')
        const events = await EventModel.find().sort({attending: -1}).limit(4)
        res.json(events)   
    } catch (error) {
        res.status(500).send('Something went wrong. Could not load main page events')
    }
})

exports.getEvent = asyncHandler(async(req, res) => {
    console.log('getEvent controller')
    const events = await EventModel.findById(req.params.id)
    res.status(200).json(events)
})

exports.getAllEvents = async(req, res) => {
    console.log('getAllEvents controller')
    const events = await EventModel.find()
    
    res.status(200).json(events)
    
}


// exports.uploadPic = asyncHandler(async(req, res) => { // make sure to combine these together later
//     const image = req.body.selectedFile // remember this is the name you set on the frontend redux, might change later
//     try {
//         const response = await cloudinary.uploader.upload(image, {
//             folder: "userImage",
//         })
//         console.log(response)

//         const result = await ImageModel.create({
//             public_id: response.public_id,
//             url: response.secure_url
//         })

//         res.json('awesome');
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ err: 'Something went wrong' });
//     }
// }
// )

exports.deleteEvent = asyncHandler(async(req, res) => {
    console.log('deleteEvent controller')
    
    
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
})

exports.updateEvent = asyncHandler(async(req, res) => {
    
    console.log('updateEvent controller')
    console.log(req.body.selectedFile)
    // console.log(req.body.se)
    
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




    
  // ** would be cool if I could find a way to only send the updated portions of the doc
})


exports.attendEvent = asyncHandler(async(req, res) => {
    console.log('attendEvent controller')
    const findEvent = await EventModel.findById(req.params.id)

    // checking to see if already attending
    let attendees = findEvent.attendee.map(x => Object.keys(x)).flat(1)
    let fullName = req.user.firstName + ' ' + req.user.lastName
    
    // if( attendees.indexOf(req.user.id) != -1) { //change this to -1
    //     res.status(401).send("You're already attending this event")
    //     console.log('here 3')
    // }
    
    // checking to see if maker is trying to attend
    // else if (req.user.id === String(findEvent.user)) {
    //     res.status(401).send("You made this event. Can't attend.")
    // }
    // else {
        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, {
            $inc: {attending: 1},
            $push: {attendee: {[req.user.id]: {
                name: fullName,
                image: req.user.image
            }}}
        })
        const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, {
            $push: {attending: updatedEvent.id}
        })

        res.status(200).json(updatedEvent)
    // }
})

exports.unattendEvent = async(req, res) => {
    try {
        console.log('unattendEvent controller')
        const fullName = req.user.firstName + ' ' + req.user.lastName
        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, {
            $pull: {attendee: {[req.user.id]: {
                name: fullName,
                image: req.user.image
            }}},
            $inc: {attending: -1}
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
    console.log('getAttendingEvents controller')

    const user = UserModel.findById(req.user.id)

    if (req.user.attending.length === 0) {
        res.json('')
    } else {
        const attendingEvents = await EventModel.find({ '_id': { $in: [req.user.attending]}})
        res.json(attendingEvents)
    }
}

exports.getUserEvents = asyncHandler(async(req, res) => {
    console.log('getUserEvents controller')
    
    // const user = UserModel.findById(req.user.id)
    // const attendingEvents = await EventModel.find({ '_id': { $in: [req.user.attending]}})
    
    const events = await EventModel.find({user: req.user.id})

    // const test = events.concat(attendingEvents)

    res.status(200).json(events)
})

exports.getProfileEvents = async(req, res) => {
    const user = await UserModel.findById(req.params.id)

    const userEvents = await EventModel.find({user: req.params.id})

    const attendingEvents = await EventModel.find({ '_id': { $in: user.attending}})

    // const allEvents = userEvents.concat(attendingEvents)

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