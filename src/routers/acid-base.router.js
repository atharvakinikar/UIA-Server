const { getDisorder } = require("../controller/acid-base.controller");
const disorderRouter = require("express").Router();

disorderRouter.post("/predict", getDisorder);
module.exports = disorderRouter;
