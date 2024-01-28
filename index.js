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
app.get("/jobs", async (req, res) => {
  try {
    // Fetch data from the API using Axios
    const apiResponse = await axios.get(`https://kaamkhoj.cyclic.app/api/jobs`);

    // Extract the relevant data from the API response
    const jobsData = apiResponse.data;

    // Render the "index.ejs" view with the fetched data
    res.render("kaamkhoj.ejs", { jobsData });
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.post("/jobs", async (req, res) => {
  try {
    const { jobData } = req.body;
    const parsedJobData = JSON.parse(jobData);
    res.render("show.ejs", { jobsData: parsedJobData });
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.use((req, res, next) => {
  res.status(404).render("error.ejs");
});
app.listen(4000, () => {
  console.log("Listening on PORT 4000");
});
