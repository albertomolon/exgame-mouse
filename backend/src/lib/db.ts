import { config } from "../config/config.js";
import mongoose from "mongoose";

mongoose.connect(config.DB_URL);

interface ICat {
  name: string;
  age: number;
}

const catSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const catModel = mongoose.model<ICat>("Cat", catSchema);
