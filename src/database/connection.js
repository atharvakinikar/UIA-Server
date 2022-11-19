require("dotenv").config();
const router = require("express").Router();
const mongoose = require("mongoose");
const mongoUri = process.env.mongoURI;
const connectDB = () => {
  mongoose
    .connect(process.env.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(res => {
      console.log("MongoDB Connected");
    });
};

module.exports = connectDB;
