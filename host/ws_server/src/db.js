import mogoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mogoose.connect("mongodb://localhost:27017/emt");
        console.log(`MongoDB connected ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;