import express from "express";
import { UserController } from "./controllers/userController";
//import { authMiddleware } from "./middlewares/authMiddleware";

const router = express.Router();
const userController = new UserController();

// Rota para criar um novo usuário
router.post("/create", userController.createUser);

router.post("/login", userController.login);

// router.use(authMiddleware);

// router.get("/profile", userController.getProfile);

export default router;
