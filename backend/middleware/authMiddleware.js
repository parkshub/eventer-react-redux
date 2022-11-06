const jwt = require('jsonwebtoken') 
const userModel = require('../models/User')
const asyncHandler = require('express-async-handler')

const auth = asyncHandler(async(req, res, next)=> {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            let token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await userModel.findById(decoded.id).select('-password')
            // later, make the request to only send user name and id, so exclude password and email
            next()
        } catch (err) {
            console.log(err)
            res.status(401)
            throw new Error('Invalid credentials')
        }
    }
})

module.exports = auth