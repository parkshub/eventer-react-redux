const jwt = require('jsonwebtoken') 
const UserModel = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const cloudinary = require('../config/cloudinary')

function generateToken(id) {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

exports.registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password, image} = req.body

    if (!firstName || !lastName || !email || !password || !image) {
        res.status(400).send('Please enter all fields')
    }

    const checkUser = await UserModel.findOne({email: email})
    if (checkUser) {
        res.status(400).send('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const regex = /#[0-9A-Fa-f]{6}/g;

    if (!image.match(regex)) { //if user actually uploaded an image
        console.log('user uploaded an image')
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
            cloudinaryId: imageResponse.public_id
        })
        
        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
            attending: [],
            image: user.image
        })

    } else if (image.match(regex)) {
        console.log('user uploaded an hex')
        const user = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            image: image,
        })

        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
            attending: [],
            image: user.image
        })
    }

    // if (user) {
    //     // this part is to see that the token hasn't been tampered with
    //     res.status(201).json({
    //         id: user.id,
    //         firstName: user.firstName,
    //         lastName: user.lastName,
    //         token: generateToken(user.id),
    //         attending: []
    //     })
    else {
        res.status(400).send('Invalid user data')
    }
})

exports.loginUser = asyncHandler(async (req, res) => {
    // get email and password
    let {email, password} = req.body

    // find user with that email
    const user = await UserModel.findOne({email: email})

    if(!user) {
        res.status(400).send('Invalid credentials')
    }
    
    else if (await bcrypt.compare(password, user.password)) {
        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
            attending: user.attending,
            image: user.image
        })
        console.log(user.firstName + ' is logged in')
    } else {
        res.status(400).send('Invalid credentials')
    }
    // compare model's user's password with the one provided using bcrypy
    // and if they match, respond with jwt
})

exports.getUser = asyncHandler(async(req, res) => {
    res.json(req.user)
    console.log(req.user)
})

exports.getUserInfo = async(req, res) => {
    const user = await UserModel.findById(req.params.id).select('-password -email -id')
    res.status(201).json(user)
}