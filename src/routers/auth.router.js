const authRouter = require("express").Router();
const {
  login,
  register,
  getProfile,
  getPatients,
} = require("../controller/auth.controller");

authRouter.post("/doctor/getpatients", getPatients);
authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/profile", getProfile);

module.exports = authRouter;
