import 'express-async-errors'
import express from "express";
import { config } from "dotenv";
// import { MongoCreateUserRepository } from "./repositories/create-user/mongo-create-user";
// import { CreateUserController } from "./controllers/create/create-user";
import mongoose from "mongoose";
import router from "./routes";
import { errorMiddleware } from './middlewares/error';

config();

const main = async () => {
  const app = express();
  app.use(express.json());

  const mongoURL = process.env.MONGODB_URL;
  if (!mongoURL) {
    console.error("MONGODB_URL não definida no arquivo .env");
    process.exit(1);
  }

  mongoose
    .connect(mongoURL, {})
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    });

  // app.post("/users", async (req, res) => {
  //   const mongoCreateUserRepository = new MongoCreateUserRepository();
  //   const createUserController = new CreateUserController(
  //     mongoCreateUserRepository
  //   );
  //   const { body, statusCode } = await createUserController.handle({
  //     body: req.body,
  //   });

  //   res.send(body).status(statusCode);
  // });

  app.use("/api", router);
  app.use(errorMiddleware)
  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`listening on port ${port}`));
};

main();
