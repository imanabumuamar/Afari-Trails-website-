import * as authService from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const result = await authService.loginStaff(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getStaffFromToken(req.user);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const user = await authService.registerStaff(req.user, req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}
