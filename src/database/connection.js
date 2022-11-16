require("dotenv").config();
const router = require("express").Router();
const mongoose = require("mongoose");
const mongoUri = process.env.mongoURI;
const connectDB = () => {
  mongoose
    .connect(
      "mongodb+srv://antons:antons@cluster0.bd0hkwu.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(res => {
      console.log("MongoDB Connected");
    });
};

module.exports = connectDB;
