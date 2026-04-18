import mongoose from "mongoose"


const mongodbUrl = process.env.MONGODB_URL

if (!mongodbUrl) {
    throw new Error("db url not found!")
}

let cashed = global.mongooseConn

if (!cashed) {
    cashed = global.mongooseConn = { conn: null, promise: null }
}


const connectDb = async () => {
    if (cashed.conn) {
        return cashed.conn;
    }

    if (!cashed.promise) {
        cashed.promise = mongoose.connect(mongodbUrl).then(c => c.connection)
    }

    try {
        const conn = await cashed.promise
        return conn
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;

//1:32:00