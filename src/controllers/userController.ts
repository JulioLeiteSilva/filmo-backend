import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-error";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

      res.status(201).send();
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
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
    const respondeData = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      cellphone: user.cellphone,
      token: token,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return res.json({
      user: respondeData,
      token: token,
    });
  }

  // async getProfile(req: Request, res: Response) {
  //   return res.json(req.user);
  // }
}
