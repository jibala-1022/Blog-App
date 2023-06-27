const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        // console.log(`Connected to Mongodb: ${mongoose.connection.host}`.bgMagenta.white)
    }
    catch(err){
        // console.log(`Mongodb connect error: ${err}`.bgRed.white)
    }
}

module.exports = connectDB