const authRouter = require("express").Router();
const {
  login,
  register,
  getProfile,
} = require("../controller/auth.controller");

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/profile", getProfile);
module.exports = authRouter;
