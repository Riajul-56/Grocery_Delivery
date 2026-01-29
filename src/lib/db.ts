// import mongoose from "mongoose";

// const mongodbUrl = process.env.MONGODB_URL;

// if (!mongodbUrl) {
//   throw new Error("db error");
// }

// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// const connectDb = async () => {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(mongodbUrl)
//       .then((conn) => conn.connection);
//   }
//   try {
//     const conn = await cached.promise;
//     return conn;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default connectDb;


import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables if they are not already loaded
dotenv.config();

const mongodbUrl = process.env.MONGODB_URL;

if (!mongodbUrl) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectdb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(mongodbUrl, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};

export default connectdb;

