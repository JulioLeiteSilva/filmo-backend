import express from "express";
import { IaController } from "../controllers/iaController";

const router = express.Router();

const iaController = new IaController();

router.post('/recomendation', iaController.MovieRecomendationService)

export default router;