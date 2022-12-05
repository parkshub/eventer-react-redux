const UserModel = require('../models/User')
const EventModel = require('../models/Events')
const ImageModel = require('../models/Images')
const asyncHandler = require('express-async-handler')
const cloudinary = require('../config/cloudinary')

// ** SINCE YOU'RE NOT USING THROW ERROR YOU DONT NEED ASYNC HANDLER, SLOWLY GET RID OF IT AND SEE IF ANYTHING BREAKS AFTER COMPLETION


// ** just a reminder we just asynchandler because async can't deal with throw new Error

exports.createEvent = asyncHandler(async(req, res) => {

    console.log('createEvent controller')
        
    const event = await EventModel.create({
        title: req.body.title,
        caption: req.body.caption,
        user: req.user.id,
        userName: req.user.name,
        attendee: [{[req.user.id]: req.user.name}]
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


exports.uploadPic = asyncHandler(async(req, res) => { // make sure to combine these together later
    const image = req.body.selectedFile // remember this is the name you set on the frontend redux, might change later
    try {
        const response = await cloudinary.uploader.upload(image, {
            folder: "products",
        })
        console.log(response)

        const result = await ImageModel.create({
            public_id: response.public_id,
            url: response.secure_url
        })

        res.json('awesome');
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
}
)


exports.getUserEvents = asyncHandler(async(req, res) => {
    console.log('getUserEvents controller')
    const events = await EventModel.find({user: req.user.id})
    res.status(200).json(events)
})

exports.deleteEvent = asyncHandler(async(req, res) => {
    console.log('deleteEvent controller')
    const event = await EventModel.findById(req.params.id)

    await checkUser(req, res, event)

    // await cloudinary.uploader.destory(event.cloudinaryId)

    await event.deleteOne()

    res.status(200).json(event.id)
})

exports.updateEvent = asyncHandler(async(req, res) => {
    
    console.log('updateEvent controller this is req.body', req.body)
    
    const findEvent = await EventModel.findById(req.params.id)

    await checkUser(req, res, findEvent)

    // so im going to have a preset of images people can upload in the sample file, if it didn't come from sample file it would be destroyed, but it's in the sample file it should be destroyed...the conditional would be something like...

    // const imageUrl = findEvent.imageUrl
    // if (!imageUrl.includes('sample')) {
        // then destory
    // } else { don't need this statement, but else just update normally}

    console.log(req.user)
    const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })


    res.status(200).json(updatedEvent)
  // ** would be cool if I could find a way to only send the updated portions of the doc
})


exports.attendEvent = asyncHandler(async(req, res) => {
    console.log('attendEvent controller')
    const findEvent = await EventModel.findById(req.params.id)

    // checking to see if already attending
    let attendees = findEvent.attendee.map(x => Object.keys(x)).flat(1)
    
    if( attendees.indexOf(req.user.id) != -1) { //change this to -1
        res.status(401).send("You're already attending this event")
        console.log('here 3')
    }
    
    // checking to see if maker is trying to attend
    else if (req.user.id === String(findEvent.user)) {
        res.status(401).send("You made this event. Can't attend.")
    }
    else {
        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, {
            $inc: {attending: 1},
            $push: {attendee: {[req.user.id]: req.user.name}}
        },
        {new: true})
        const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, {
            $push: {attending: updatedEvent.id}
        },
        {new: true})

        res.status(200).json(updatedEvent)
    }
})

exports.unattendEvent = async(req, res) => {
    try {
        console.log('unattendEvent controller')
        
        const updatedEvent = await EventModel.findById(req.params.id)
        updatedEvent.attending -= 1
        updatedEvent.attendee = updatedEvent.attendee.filter(x => Object.keys(x)[0] !==req.user.id)
        await updatedEvent.save()


        localStorage.removeItem('event')
        localStorage.setItem('event', event)
        console.log('this is updatedEvent', updatedEvent)

        // const userAttendingEvents = req.user.attending.filter(x => x!==eventId)
        // const updatedUser = UserModel.findByIdAndUpdate(req.user.id, {attending: userAttendingEvents}, {
        //     new:true
        // })

        res.status(200).json(updatedEvent)

    } catch (error) {
        res.status(500).send('something went wrong')
    }
}


function checkUser(req, res, doc) {

    if (req.user.id !== String(doc.user)) {
        res.status(401).send("Unauthorized user")
    }
}