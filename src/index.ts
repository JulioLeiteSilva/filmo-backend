import "express-async-errors";
import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute";
import iaRoute from "./routes/IaRoute";
import { errorMiddleware } from "./middlewares/error";
import { env } from "./config/env";
import { ZodError } from "zod";
import MovieRoute from "./routes/MovieRoute";

config();

const main = async () => {
  try {
    const app = express();
    app.use(express.json());

    const mongoURL = env.MONGODB_URL;

    mongoose
      .connect(mongoURL, {})
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
      });

    
    app.use("/api", userRoute, iaRoute, MovieRoute);
    app.use(errorMiddleware);
    const port = env.PORT || 8000;

    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (err) {
    if (err instanceof ZodError) {
      console.error(err);
      process.exit(1);
    }
    process.exit(1);
  }
};

main();
