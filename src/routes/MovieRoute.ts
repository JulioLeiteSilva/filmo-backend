import express from "express";
import { MovieController } from "../controllers/movieController";

const router = express.Router();
const movieController = new MovieController();

router.get("/moviesTittle", movieController.getAllMoviesTittles);
router.post("/bestRatedMoviesTittle", movieController.getBestRatedMoviesTittlesByGenre)

export default router;
