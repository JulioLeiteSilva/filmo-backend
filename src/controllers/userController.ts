import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-error";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MovieService } from "../services/iaService";
import { Movie } from "../models/tmdbMovieModel";

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { name, username, email, cellphone, password } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("E-mail já existe");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newUser = await UserModel.create({
        name,
        username,
        email,
        cellphone,
        password,
      });
      console.log(newUser);
      res.status(201).send();
    } catch (error: unknown) {
      if (error instanceof BadRequestError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "6h",
    });


    const myList: string[] = user.myList;
    let results: Movie[] = [];
    const movieService = new MovieService();

    if(myList.length > 0) {
        results = await Promise.all(
        myList.map(async (query) => {
          const result = await movieService.searchMovie(query);
          return result.results[0]; // Assumindo que `results` é o array de resultados da API
        })
      );
    }
    

    const respondeData = {
      name: user.name,
      username: user.username,
      email: user.email,
      cellphone: user.cellphone,
      token: token,
      myList: results
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return res.json({
      user: respondeData,
    });
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  async addTittle(req: Request, res: Response) {
    try {
      const { id, tittle } = req.body;

      const user = await UserModel.findById(id);
      if (!user) {
        throw new BadRequestError("Usuário não encontrado");
      }

      if (user.myList.includes(tittle)) {
        throw new BadRequestError("Título já está na lista");
      }

      user.myList.push(tittle);
      await user.save();

      res.status(201).send();
    } catch (error: unknown) {
      if (error instanceof BadRequestError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deleteTittle(req: Request, res: Response) {
    try {
      const { id, tittle } = req.body;

      const user = await UserModel.findById(id);
      if (!user) {
        throw new BadRequestError("Usuário não encontrado");
      }

      if (!user.myList.includes(tittle)) {
        throw new BadRequestError("Título não está na lista");
      }

      user.myList = user.myList.filter((movie) => movie !== tittle);
      await user.save();

      res.status(200).send();
    } catch (error: unknown) {
      if (error instanceof BadRequestError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
