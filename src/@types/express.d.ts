import UserModel from "../models/userModel";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<UserModel>;
    }
  }
}
