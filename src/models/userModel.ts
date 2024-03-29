import mongoose, { Schema, Document, CallbackError } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  name: string;
  username: string;
  email: string;
  cellphone: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  cellphone: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
