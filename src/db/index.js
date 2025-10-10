import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js';

/*
  MONGODB CONNECTION SETUP
---------------------------
This file handles the connection between our Node.js app and MongoDB 
using the official Mongoose library.

🧠 Why use Mongoose?
- It simplifies interactions with MongoDB by providing a schema-based model.
- Handles data validation, query building, and relationships easily.
*/

const connectDB = async () => {
  /*
   Connecting to MongoDB
  -----------------------
  - We use an async function since mongoose.connect() returns a promise.
  - The connection URI is composed using:
      👉 process.env.MONGODB_URI → base MongoDB connection string from environment variables.
      👉 DB_NAME → database name imported from constants.js.
  */
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED: ", error);
    process.exit(1) // Stops the server immediately to prevent further execution.
  }
}

export default connectDB