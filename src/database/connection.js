const router = require("express").Router();
const mongoose = require("mongoose");
require("dotenv").config();
const mongoUri =
  "mongodb+srv://antons:antons@cluster0.bd0hkwu.mongodb.net/?retryWrites=true&w=majority";
const connectDB = () => {
  mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
      console.log("MongoDB Connected");
    });
};

module.exports = connectDB;
