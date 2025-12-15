import Router from "";
import bcrypt from "bcryptjs";
import User from "../models/users";
import { generateJWT } from "../middlewares/users";

const router = new Router();

/**
 * POST /login
 * Autenticazione utente e generazione JWT
 */
router.post("/login", async (ctx: { request: { body: { email: any; password: any; }; }; status: number; body: { message: string; }; }, next: () => any) => {
  const { email, password } = ctx.request.body;

  // 1. Verifica esistenza utente
  const user = await User.findOne({ email });
  if (!user) {
    ctx.status = 401;
    ctx.body = { message: "Credenziali non valide" };
    return;
  }

  // 2. Confronto password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    ctx.status = 401;
    ctx.body = { message: "Credenziali non valide" };
    return;
  }

  // Passa al middleware di generazione JWT
  await next();
}, generateJWT, async (ctx: { status: number; body: { token: any; }; state: { token: any; }; }) => {
  ctx.status = 200;
  ctx.body = {
    token: ctx.state.token
  };
});

export default router;
