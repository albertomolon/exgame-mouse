import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcrypt";
import { Context, Next } from "koa";

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

// Middleware 1: Validazione dati utente
export const validateUserRegistration = async (ctx: Context, next: Next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/[!@#$%^&*(),.?":{}|<>]/)
      .required(),
  });

  const { error } = schema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = { message: "Validation error", details: error.details };
    return;
  }

  await next();
};

// Middleware 2: Hash password
export const hashPassword = async (ctx: Context, next: Next) => {
  const { password } = ctx.request.body as { password: string };

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  ctx.request.body.password = hashedPassword;

  await next();
};

const userModel = mongoose.model<Iuser>("User", userSchema);

export default userModel;
