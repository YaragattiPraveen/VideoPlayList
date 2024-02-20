import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `\n${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(`Db Connected successfully!: ${connection}`);
  } catch (error) {
    console.log("DB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
