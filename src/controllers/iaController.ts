import  { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-error";
import { exec } from 'child_process';


export class IaController{
  async MovieRecomendationService(req: Request, res: Response){
    const {name} = req.body;
    const formatedName = name.replace(/\s/g, '')
    console.log(formatedName)

    const command = `python3 ../filmo-ia/recomendation_ai/src/main.py ${formatedName}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error(`Erro ao executar o script: ${error}`);
          return res.status(500).send('Erro ao processar a solicitação.');
      }
      
      const resultadoIA = stdout.trim();
      console.log(resultadoIA);
      res.json({ resultadoIA });

  });
  }
}