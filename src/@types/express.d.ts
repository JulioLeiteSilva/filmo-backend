import {User} from "src/models/user.ts"

declare global {
  namespace Express{
    export interface Request {
      user: Partial<User>
    }
  }
}