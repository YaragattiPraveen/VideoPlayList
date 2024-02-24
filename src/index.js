import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import errorHandlerMiddleware from "./middleware/errorHandler.middlware.js";

// Env variable access
dotenv.config({
  path: "./.env",
});

// DB connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`The server is running on PORT: ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });

// error middleware
app.use(errorHandlerMiddleware)