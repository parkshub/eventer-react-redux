const jwt = require('jsonwebtoken') 
const userModel = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

function generateToken(id) {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

exports.registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    console.log(JSON.stringify(req.body))
    console.log(name, email, password)


    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    const checkUser = await userModel.findOne({email: email})
    if (checkUser) {
        res.status(400)
        throw new Error ('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await userModel.create({
        name: name,
        email: email,
        password: hashedPassword
    })

    if (user) {
        // this part is to see that the token hasn't been tampered with
        res.status(201).json({
            name: user.name,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})


exports.loginUser = asyncHandler(async (req, res) => {
    // get email and password
    let {email, password} = req.body
    // find user with that email
    const user = await userModel.findOne({email: email})
    if (await bcrypt.compare(password, user.password)) {
        res.status(201).json({
            token: generateToken(user.id)
        })
        console.log(user.name + ' is logged in')
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
    // compare model's user's password with the one provided using bcrypy
    // and if they match, respond with jwt
})
exports.getUser // this is going to work yet, just need it to test that auth middleware works