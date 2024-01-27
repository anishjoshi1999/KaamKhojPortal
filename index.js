const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
//Middleware
dotenv.config();

const app = express();
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.get("/", async (req, res) => {
  try {
    res.render("index.ejs");
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    // Fetch data from the API using Axios
    const apiResponse = await axios.get(
      `https://kaamkhoj.cyclic.app/api/${type}`
    );

    // Extract the relevant data from the API response
    const jobsData = apiResponse.data;

    // Render the "index.ejs" view with the fetched data
    res.render("kaamkhoj.ejs", { jobsData, type });
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.get("/:type/:value", async (req, res) => {
  try {
    const { type, value } = req.params;
    const apiResponse = await axios.get(
      `https://kaamkhoj.cyclic.app/api/${type}`
    );
    const temp = apiResponse.data.filter((element) => {
      return element.name === value;
    });
    res.render("show.ejs", { jobsData: temp[0], type });
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.listen(4000, () => {
  console.log("Listening on PORT 4000");
});
