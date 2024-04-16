import mongoose from "mongoose";

// create mongoDB connection

export const mongodbConnection = async() =>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_STRING);
        console.log(`MongoDB Connection Successfull`.bgMagenta.black);
    } catch (error) {
        console.log(error.message);
    }
}


