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

  async getBestRatedMoviesTittlesByGenre(
    req: Request,
    res: Response
  ): Promise<void> {
    const { genre } = req.body;
    if (!genre) {
      res.status(400).send("Genre parameter is required");
      return;
    }
    try {
      const movies = await MovieModel.find(
        {
          genre: { $regex: `^${genre}`, $options: "i" },
          orig_lang: " English",
          status: " Released",
        },
        { _id: 0, names: 1 }
      )
        .sort({ score: -1 })
        .limit(20)
        .exec();

      res.status(200).json(movies);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
}
