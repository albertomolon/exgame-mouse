import mongoose from "mongoose";

export interface Iuser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  role: "user" | "teacher" | "admin";
  data: any;
}

const userSchema = new mongoose.Schema<Iuser>({
  id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "teacher", "admin"], default: "user" },
  data: { type: mongoose.Schema.Types.Mixed, required: false },
});

const userModel = mongoose.model<Iuser>("User", userSchema);

export default userModel;
