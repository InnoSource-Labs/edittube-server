const mongoose = require("mongoose")
const MONGO_URI = process.env.MONGO_URI
const connectDb = async ()=>{
    mongoose.connect(MONGO_URI)
    const dbConnect = mongoose.connection
    dbConnect.once("open",()=>{
        console.log("successfull connected to database");
    })
    dbConnect.on("error",()=>{
        console.log("failed to connnect to  database");
    })
}
module.exports = {connectDb}