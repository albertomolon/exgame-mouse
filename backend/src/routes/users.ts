import Router from "@koa/router";
import bcrypt from "bcryptjs";
import UsersDAO from "../dao/users.dao";
import {
  generateJWT,
  hashPassword,
  validateRegistration,
} from "../middlewares/users";

const router = new Router({
  prefix: "/api/users",
});

const usersDAO = new UsersDAO();

router.get("/", async (ctx) => {
  try {
    const users = await usersDAO.getAll();
    ctx.status = 200;
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

router.post(
  "/registration",
  validateRegistration,
  hashPassword,
  async (ctx) => {
    try {
      const { email } = ctx.request.body;
      const existingUser = await usersDAO.getByEmail(email);
      if (existingUser) {
        ctx.status = 409;
        ctx.body = { error: "Email already in use" };
        return;
      }

      const newUser = await usersDAO.create(ctx.request.body);
      if (!newUser || !newUser._id) {
        ctx.status = 400;
        ctx.body = { error: "User registration failed" };
        return;
      }
      ctx.status = 201;
      ctx.body = newUser;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  },
);

router.post("/login", async (ctx, next) => {
  try {
    const { email, password } = ctx.request.body;

    // 1. Verifica esistenza utente
    const existingUser = await usersDAO.getByEmail(email);
    if (!existingUser) {
      ctx.status = 401;
      ctx.body = { error: "Invalid email or password" };
      return;
    }

    // 2. Confronto password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      ctx.status = 401;
      ctx.body = { error: "Invalid email or password" };
      return;
    }

    // Passa al middleware JWT
    await next();
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}, generateJWT, async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    message: "Login successful",
    token: ctx.state.token,
  };
});

export default router;
