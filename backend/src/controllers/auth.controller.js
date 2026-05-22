import * as authService from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const { email, name, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const user = await authService.registerAdmin({ email, name, password });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const result = await authService.loginAdmin({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
