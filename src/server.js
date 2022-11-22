require("dotenv").config();
const express = require("express");
const Router = require("./routers");
const cors = require("cors");
const connectDB = require("./database/connection")();
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api", Router);

let port = process.env.PORT || 4000;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, function () {
  console.log("Server is up and running at port:", port);
});
