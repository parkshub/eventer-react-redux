const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_STRING)
        console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline)
    
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB