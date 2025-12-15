import Router from "@koa/router";
import UsersDAO from "../dao/users.dao";
import userModel from "../models/users";
import { validateUserRegistration, hashPassword } from "../models/users";

const router = new Router({
  prefix: "/api/users",
});

const usersDAO = new UsersDAO();

router.get("/",  async (ctx) => {
  try {
    const users =  await usersDAO.getAll();
    ctx.status = 200;
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

router.post(
  "/",
  validateUserRegistration,
  hashPassword,
  async (ctx) => {
    try {
      const { email, password } = ctx.request.body as {
        email: string;
        password: string;
      };

      // Verifica se l'utente esiste già
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        ctx.status = 409;
        ctx.body = { error: "User already exists" };
        return;
      }

      // Creazione e salvataggio nuovo utente
      const newUser = new userModel({
        email,
        password, // password già hashata
      });

      await newUser.save();

      ctx.status = 201;
      ctx.body = { message: "User created successfully" };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  }
);

export default router;