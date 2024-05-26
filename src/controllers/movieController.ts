import { Request, Response } from "express";
import MovieModel from "../models/movieModel";
import { MovieService } from "../services/iaService";
import { Movie } from "../models/tmdbMovieModel";

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
    console.log(genre);
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

      const movieService = new MovieService();
      const movieTitles = movies.map((movie) => movie.names);
      console.log(movieTitles);
      const results: Movie[] = await Promise.all(
        movieTitles.map(async (query) => {
          const result = await movieService.searchMovie(query);
          return result.results[0]; // Assumindo que `results` é o array de resultados da API
        })
      );

      res.status(200).json(results);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
}
