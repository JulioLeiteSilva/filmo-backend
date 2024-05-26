import { Request, Response } from "express";
//import { BadRequestError } from "../helpers/api-error";
import { exec } from "child_process";
import { Movie } from "../models/tmdbMovieModel";
import { MovieService } from "../services/iaService";
import { BadRequestError } from "../helpers/api-error";

const movieService = new MovieService();

export class IaController {
  async MovieRecomendationService(req: Request, res: Response) {
    const { name } = req.body;
    const formatedName = name.replace(/[^a-zA-Z0-9]/g, "");
    console.log(formatedName)

    const command = `python3 ../filmo-ia/recomendation_ai/src/main.py ${formatedName}`;
    exec(command, async (error, stdout /*stderr*/) => {
      if (error) {
        return res.status(500).send("Erro ao processar a solicitação.");
      }

      const resultAI = JSON.parse(stdout.trim());

      try {
        const queries: string[] = resultAI; // Receber a lista de strings no corpo da requisição

        if (!queries || !Array.isArray(queries)) {
          res
            .status(400)
            .send({ message: "Queries parameter must be an array of strings" });
          return;
        }

        const results: Movie[] = await Promise.all(
          queries.map(async (query) => {
            const result = await movieService.searchMovie(query);
            return result.results[0]; // Assumindo que `results` é o array de resultados da API
          })
        );

        //res.json(results);

        res.json(results);
      } catch (error) {
        throw new BadRequestError("Falha na comunicação");
        //res.status(500).send({ message: error.message });
      }
    });
  }
}
