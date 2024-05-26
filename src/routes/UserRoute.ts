import express from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMidlleware";

const router = express.Router();
const userController = new UserController();

router.post("/create", userController.createUser);

router.post("/login", userController.login);

router.use(authMiddleware);
router.get("/profile", userController.getProfile);

router.post("/myListAddTittle", userController.addTittle);
router.post("/myListDeleteTittle", userController.deleteTittle);

export default router;
