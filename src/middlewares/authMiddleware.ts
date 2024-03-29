// import jwt from "jsonwebtoken";
// import { NextFunction, Request, Response } from "express";
// import { UnauthorizedError } from "../helpers/api-error";
// import UserModel from "../models/userModel";

// type JwtPayload = {
//   id: number;
// };

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     throw new UnauthorizedError("Não autorizado");
//   }

//   const token = authorization.split(" ")[1];

//   const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as JwtPayload;

//   const user = await UserModel.findOne({ id });

//   if (!user) {
//     throw new UnauthorizedError("Não autorizado");
//   }
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: _, ...loggedUser } = user;

//   req.user = loggedUser;

//   next();
// };
