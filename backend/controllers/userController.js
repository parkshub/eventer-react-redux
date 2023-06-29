const jwt = require("jsonwebtoken") 
const UserModel = require("../models/User")
const bcrypt = require("bcryptjs")
const cloudinary = require("../config/cloudinary")
const EventModel = require("../models/Events")

function generateToken(id) {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        // expiresIn: "7d"
    })
}

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, image, bio } = req.body

    if (!firstName || !lastName || !email || !password || !image || bio==="") {
        res.status(400).send("Please enter all fields")
    }

    const checkUser = await UserModel.findOne({email: email})
    if (checkUser) {
        res.status(400).send("User already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const regex = /#[0-9A-Fa-f]{6}/g;

    if (!image.match(regex)) {
        const imageResponse = await cloudinary.uploader.upload(image, {
            folder: "profilePic",
            transformation: [
                {height: 300, width:300, crop: "scale"},
                {radius: "max"}
            ]
        })
        
        const user = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            image: imageResponse.secure_url,
            cloudinaryId: imageResponse.public_id,
            bio: bio
        })
        
        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
            attending: [],
            image: user.image,
            bio: user.bio
        })

    } else if (image.match(regex)) {
        const user = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            image: image,
            bio: bio,
        })

        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
            attending: [],
            image: user.image,
            bio: user.bio
        })
    } else {
        res.status(400).send("Invalid user data")
    }
}

exports.loginUser = async (req, res) => {
    let {email, password} = req.body

    const user = await UserModel.findOne({email: email})

    if(!user) {
        res.status(400).send("Invalid credentials")
    }
    else if (await bcrypt.compare(password, user.password)) {
        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
            attending: user.attending,
            image: user.image,
            bio: user.bio
        })
    } else {
        res.status(400).send("Invalid credentials")
    }
}

exports.getUser = async(req, res) => {
    res.json(req.user)
}

exports.getUserInfo = async(req, res) => {
    const user = await UserModel.findById(req.params.id).select("-password -email -id")
    res.status(201).json(user)
}

exports.changeProfile = async(req, res) => {    
    const regex = /#[0-9A-Fa-f]{6}/g;

    const { id, firstName, lastName, image, bio } = req.body

    const previousUser = await UserModel.findById(id)

    const imageResponse = 
        image.startsWith('data:image') ?
            await cloudinary.uploader.upload(image, {
                folder: "profilePic",
                transformation: [
                    {height: 300, width:300, crop: "scale"},
                    {radius: "max"}
                ]
            }) :
            image

    if (image.match(regex)) {
        if (previousUser.cloudinaryId !== '') {
            await cloudinary.uploader.destroy(previousUser.cloudinaryId)
        }

        const updateInfo = {
            firstName: firstName,
            lastName: lastName,
            image: imageResponse,
            cloudinaryId: '',
            bio: bio
        }

        const user = await UserModel.findByIdAndUpdate(id, updateInfo, {returnDocument: 'after'})

        // const events = await EventModel.find(
        //     {
        //         "_id" : {$in : user.attending}
        //     }
        // )

        // for (i of events) {
        //     const oldAttendee = i.attendee.filter(x => Object.keys(x)[0] !== req.params.id)
        //     const newAttendee = {[req.params.id]: {"name": user.name, "image": user.image}}
        //     const attendees = oldAttendee.concat(newAttendee)
        //     i.attendee = attendees
        //     await i.save()
        // }

        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
            attending: user.attending,
            image: user.image,
            bio: user.bio
        })

    } else if (!image.match(regex)){
        if (previousUser.cloudinaryId !== '') {
            await cloudinary.uploader.destroy(previousUser.cloudinaryId)
        }

        const updateInfo = {
            firstName: firstName,
            lastName: lastName,
            image: imageResponse.secure_url,
            cloudinaryId: imageResponse.public_id,
            bio: bio
        }

        const user = await UserModel.findByIdAndUpdate(id, updateInfo, {returnDocument: 'after'})

        // const events = await EventModel.find(
        //     {
        //         "_id" : {$in : user.attending}
        //     }
        // )

        // for (i of events) {
        //     const oldAttendee = i.attendee.filter(x => Object.keys(x)[0] !== user.id)
        //     const newAttendee = {[user.id]: {"name": user.firstName + " " + user.lastName, "image": user.image}}
        //     const attendees = oldAttendee.concat(newAttendee)
        //     i.attendee = attendees
        //     await i.save()
        // }

        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
            attending: user.attending,
            image: user.image,
            bio: user.bio
        })
    } else {
        res.status(201).json(previousUser)
    }
}

exports.test = async(req, res) => {
    const user = await UserModel.findById(req.params.id)
    const events = await EventModel.find(
        {
            "_id" : {$in : user.attending}
        }
    )

    for (i of events) {
        const oldAttendee = i.attendee.filter(x => Object.keys(x)[0] !== req.params.id)
        const newAttendee = {[req.params.id]: {"name": "andrew aaaa", "image": user.image}}
        const attendees = oldAttendee.concat(newAttendee)
        i.attendee = attendees
        await i.save()
    }

    res.json(events)
}
