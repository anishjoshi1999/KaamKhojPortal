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
app.get("/upload", async (req, res) => {
  try {
    res.render("form.ejs");
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.post("/upload", async (req, res) => {
  try {
    // Log the received form data
    console.log(req.body);

    // Create a POST request using Axios
    const apiUrl = "https://kaamkhoj.cyclic.app/api/upload"; // Replace with your actual API endpoint
    const response = await axios.post(apiUrl, req.body);

    // Log the response from the API
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    console.error("Error handling form submission:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery; // Get the search query from the request parameters

    if (!searchQuery) {
      // If no search query is provided, you can handle it as needed
      res.status(400).json({ error: "Search query is required." });
      return;
    }
    const searchUrl = "https://kaamkhoj.cyclic.app/api/search";
    const response = await axios.get(searchUrl, {
      params: {
        searchQuery: searchQuery,
      },
    });
    let value = {
      name: searchQuery,
      jobs: response.data.matchedJobs,
      totalAvailableJobs: response.data.matchedJobs.length,
    };

    res.render("show.ejs", { jobsData: value });
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
app.get("/refresh", (req, res) => {
  let apiURL = "https://kaamkhoj.cyclic.app/kaamkhoj/jobs";
  const response = axios.get("https://kaamkhoj.cyclic.app/kaamkhoj/jobs");
  console.log("Route Hit for Refreshing the Data");
  res.redirect("/jobs");
});
app.get("/view", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/api/view");
    let temp = response.data;
    res.render("viewProfile", { jobsData: temp });
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
