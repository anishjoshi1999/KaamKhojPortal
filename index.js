const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
//Middleware
dotenv.config();

const app = express();
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
// Enable body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGODB_URI = `${process.env.MONGODB_URI}`;
//Import Routes
const kaamKhojRoute = require("./Routes/kaamKhoj");
const apiRoute = require("./Routes/apiRoute");
//ConnectDB

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on :${PORT}`);
    });
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

//Home Route
app.get("/", async (req, res) => {
  try {
    res.render("index.ejs");
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.use("/api", apiRoute);
app.use("/kaamkhoj", kaamKhojRoute);

app.use((req, res, next) => {
  res.status(404).render("error.ejs");
});
