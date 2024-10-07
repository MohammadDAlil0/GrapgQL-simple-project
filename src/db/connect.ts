import mongoose from 'mongoose';

export const connectDB = async (url : string) => {
    try {
        await mongoose.connect(url);
        console.log("Connected to database");
    }
    catch(err) {
        console.log(err);
    }
}