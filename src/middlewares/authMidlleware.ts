import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../helpers/api-error'
import UserModel from '../models/userModel'
import jwt from 'jsonwebtoken'

type JwtPayload = {
	id: string
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { authorization } = req.headers

	if (!authorization) {
		throw new UnauthorizedError('Não autorizado')
	}

	const token = authorization.split(' ')[1]
  
	const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload
  
	const user = await UserModel.findById( id )
 
  
	if (!user) {
		throw new UnauthorizedError('Não autorizado')
	}

	const respondeData = {
    name: user.name,
    username: user.username,
    email: user.email,
    cellphone: user.cellphone,
    token: token,
  };

	req.user = respondeData

	next()
}