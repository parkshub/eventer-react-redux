const express = require('express')
const path = require('path')
const connectDB = require('./config/database')
const colors = require('colors');
const cors = require('cors')
require('dotenv').config({path: "./backend/config/.env"})

const userRouter = require('./routers/userRoute')
const eventRouter = require('./routers/eventRouter')

connectDB()

const app = express()

app.use(express.json({ limit: '50mb'}))
app.use(express.urlencoded({ limit:'50mb', extended: true, parameterLimit:50000}))
app.use(cors());

app.use('/api/user', userRouter)
app.use('/api/event', eventRouter)



app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on post ${process.env.PORT}`)
})