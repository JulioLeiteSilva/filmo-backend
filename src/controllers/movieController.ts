import { Request, Response } from "express";
import MovieModel from "../models/movieModel";

export class MovieController {
  async getAllMoviesTittles(req: Request, res: Response) {
    try {
      const movies = await MovieModel.find({}, { names: 1, _id: 0 });
      const movieTitles = movies.map((movie) => movie.names);
      res.status(200).json({ titles: movieTitles });
    } catch (err) {
      res.status(500).json({ message: "Failed to get movies.", error: err });
    }
  }
}
