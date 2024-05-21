import { Request, Response } from "express";
//import { BadRequestError } from "../helpers/api-error";
import { exec } from 'child_process';
import fetch from 'node-fetch';


export class IaController {
  async MovieRecomendationService(req: Request, res: Response) {
    const { name } = req.body;
    const formatedName = name.replace(/\s/g, '')
    console.log(formatedName)

    const command = `python3 ../filmo-ia/recomendation_ai/src/main.py ${formatedName}`;
    exec(command, (error, stdout, /*stderr*/) => {
      if (error) {
        console.error(`Erro ao executar o script: ${error}`);
        return res.status(500).send('Erro ao processar a solicitação.');
      }

      const resultadoIA = JSON.parse(stdout.trim());
      console.log(resultadoIA);
      console.log(encodeURIComponent(resultadoIA[0]));

      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(resultadoIA[0])}&include_adult=false&language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMzc4MzFiYWQ5YTY3OGM2NDZkZDlmYWFkZDIzMDI5MiIsInN1YiI6IjY2MDlmMDI3NjJmY2QzMDE3Y2UwNGZhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.77D_K8boI8f1NbgfPaMctB-n36DExhnndycRyMEWBVk'
        }
      };

      fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json.results[0]))
        .catch(err => console.error('error:' + err));


      res.json({ resultadoIA });

    });
  }
}