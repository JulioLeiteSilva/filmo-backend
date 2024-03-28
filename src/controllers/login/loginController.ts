import { Request, Response } from "express";
import {userRepository} from 'src/repositories/create-user/mongo-create-user'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


export class loginController{
  async login(req:Request, res:Response){
    const {email, password} = req.body;

    const user = await userRepository.findOneBy({email})
    if (!user){
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const verifyPassword = await bcrypt.compare(password, user.password)

    if(!verifyPassword){
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const token = jwt.sign({ id: user.id}, process.env.JWT_PASS ?? '', {
      expiresIn: '6h'
    })
    
    const {password:_, ...userLogin} = user
    return res.json({
      user: userLogin,
      token: token,
    })
  }

  async getProfile(req: Request, res: Response){
    
    return res.json(req.user)

  }
  
}