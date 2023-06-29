const UserModel = require('../models/User')
const EventModel = require('../models/Events')
const cloudinary = require('../config/cloudinary')
const mongoose = require('mongoose')

exports.testCreate = async(req, res) => {


    const event = await (await EventModel.create({user: req.user.id, test: [req.user]})).populate('test')
    
    // console.log('this is the event test', event.populate('test'))
    res.json(event)
    
    // const user = await UserModel.findByIdAndUpdate(coin.userId, {
    //     $push: {transactions: coin.id}
    // },{new: true}).populate('transactions')
}

exports.testAttend = async (req, res) => {
    const event  = await EventModel.findByIdAndUpdate(req.params.id, {
        $push: {test: req.user}
    },{new: true}).populate('test')

    res.json(event)
}

exports.testUnattend = async (req, res) => {
    const event = await EventModel.findByIdAndUpdate(req.params.id, {
        $pull: {test: req.user.id},
    })

    res.json(event)
}

// this needs changing
// this needs changing
// this needs changing
// this needs changing

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
        attendee: [req.user.id],
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

// this needs minor changing just populate
exports.getEvent = async(req, res) => {
    console.log('this was req.params.id', req.params.id)
    const events = await EventModel.findById(req.params.id)
    // const events = await EventModel.findById(req.params.id, {new: true}).populate('attendee')
    // console.log('this was the events from get Event', await events.populate('attendee'))
    res.status(200).json(await events.populate('attendee'))
}
// this needs minor changing just populate
exports.getAllEvents = async(req, res) => {
    const events = await EventModel.find()
    
    res.status(200).json(events)
    
}

// this need major changing
// you need to go into everyone one of the attendees and delete this event from their 'attending'
// do this last
exports.deleteEvent = async(req, res) => {
    const event = await EventModel.findById(req.params.id).populate('attendee')
    // await checkUser(req, res, event)
    
    const attendees = event.attendee.map(x => x._id || x.id)
    
    const users = await UserModel.find({ '_id': { $in: attendees}})
    // console.log(String(users[1].attending[0]))
    // console.log(mongoose.Types.ObjectId('649cb66aa113e8b5883dc015'))
    // console.log(req.user.id, 'this is requserid')
    // // console.log(users[1]._id)

    // // const test = await UserModel.updateMany(
    // //     { '_id': {$in: attendees}}, 
    // //     {$pull: {attending: mongoose.Types.ObjectId(req.user.id)}},
    // //     {new: true}
    // // )

    const filterEvents = async(users) => {
        for (let user of users) {
            user.attending = user.attending.filter(event => String(event) !== req.params.id)
            console.log(user.attending)
            await user.save()
        }
    }

    await filterEvents(users)


    await cloudinary.uploader.destroy(event.cloudinaryId)

    await event.deleteOne()

    return res.status(200).json(users)
}

// this need minor changing just populate
exports.updateEvent = async(req, res) => {
    const event = await EventModel.findById(req.params.id).populate('attendee')
    
    await checkUser(req, res, event)

    const image = req.body.selectedFile
    
    if (image == event.imageUrl) {
        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body.formData, {
            new: true
        }).populate('attendee')
        res.status(200).json(updatedEvent)
    } else {
        await cloudinary.uploader.destroy(event.cloudinaryId)

        // const imageResponse = await cloudinary.uploader.upload(image, {
        //     folder: "userImage",
        // })
        const imageResponse = await cloudinary.uploader.upload(image, {
            folder: "userImage",
            transformation: [
                {height: 500, width: 500, crop: "scale"}
            ]
        })
        
        req.body.formData.imageUrl = imageResponse.secure_url
        req.body.formData.cloudinaryId = imageResponse.public_id

        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body.formData, {
            new: true
        }).populate('attendee')
        
        res.status(200).json(updatedEvent)
    }    
}

// this need minor changing just populate
// and change push to only push req.user.id
exports.attendEvent = async(req, res) => {
    console.log('this is params', req.params.id)

    // const findEvent = await EventModel.findById(req.params.id)
    // console.log('this is findEvent', findEvent)
    // await findEvent.populate('attendee')
    // console.log('this is findEvent2', findEvent)

    // let attendees = findEvent.attendee.map(x => x._id)
    // let fullName = req.user.firstName + ' ' + req.user.lastName

    const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, {
        $inc: {attending: 1},
        $push: {attendee: req.user.id}
    }, {
        new: true
    })

    // await updatedEvent.populate('attendee')

    console.log('this is the update event after attending', updatedEvent)

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, {
        $push: {attending: updatedEvent.id}
    })

    res.status(200).json(await updatedEvent.populate('attendee'))
}


// this need some changing
// change the pull request --> unsure how it'll respond, may have to test first
// and populate
exports.unattendEvent = async(req, res) => {
    try {
        const fullName = req.user.firstName + ' ' + req.user.lastName
        const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, {
            $pull: {attendee: req.user.id},
            $inc: {attending: -1}
        }, {
            new: true
        }).populate('attendee')

        const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, {
            $pull: {attending: updatedEvent.id}
        })

        res.status(200).json(updatedEvent)
    } catch (error) {
        res.status(500).send('something went wrong')
    }
}

// this need minor changing just populate, may have specify {new: true}
exports.getAttendingEvents = async(req, res) => {
    const user = UserModel.findById(req.user.id)

    if (req.user.attending.length === 0) {
        res.json('')
    } else {
        const attendingEvents = await EventModel.find({ '_id': { $in: [req.user.attending]}})
        res.json(attendingEvents)
    }
}

// i dont think this need changing
exports.getUserEvents = async(req, res) => {
    const events = await EventModel.find({user: req.user.id})

    res.status(200).json(events)
}

// i dont think this need changing
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