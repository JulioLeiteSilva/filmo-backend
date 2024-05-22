import mongoose, { Schema, Document } from "mongoose";

export interface MovieDocument extends Document {
  names: string;
  date_x: string;
  score: number;
  genre: string;
  overview: string;
  crew: string;
  orig_tittle: string;
  status: string;
  orig_lang: string;
  budget_x: number;
  revenue: number;
  country: string;
}

const MovieSchema = new Schema<MovieDocument>({
  names: { type: String, required: true },
  date_x: { type: String, required: true },
  score: { type: Number, required: true },
  genre: { type: String, required: true },
  overview: { type: String, required: true },
  crew: { type: String, required: true },
  orig_tittle: { type: String, required: true },
  status: { type: String, required: true },
  orig_lang: { type: String, required: true },
  budget_x: { type: Number, required: true },
  revenue: { type: Number, required: true },
  country: { type: String, required: true },
});

const MovieModel = mongoose.model<MovieDocument>("Movie", MovieSchema);

export default MovieModel;
