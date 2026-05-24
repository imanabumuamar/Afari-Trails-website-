import * as usersService from "../services/users.service.js";

export async function list(req, res, next) {
  try {
    const data = await usersService.listUsers(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const user = await usersService.updateUser(req.user, req.body);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await usersService.deleteUser(req.user, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
