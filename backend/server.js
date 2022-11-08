const express = require('express')
const path = require('path')
const connectDB = require('./config/database')
const colors = require('colors');
require('dotenv').config({path: "./backend/config/.env"})

const userRouter = require('./routers/userRoute')
const eventRouter = require('./routers/eventRouter')

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/user', userRouter)
app.use('/api/goal', eventRouter)



app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on post ${process.env.PORT}`)
})