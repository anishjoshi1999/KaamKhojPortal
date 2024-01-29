const express = require("express");
const Job = require("../Models/Job");
const Upload = require("../Models/Upload");
const { jobFilterMethod } = require("../utils/filterMethod");

const router = express.Router();

router.get("/jobs", async (req, res) => {
  try {
    let jobsData = await jobFilterMethod();
    res.render("kaamkhoj.ejs", { jobsData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/jobs", async (req, res) => {
  try {
    const { jobData } = req.body;
    const parsedJobData = JSON.parse(jobData);
    res.render("show.ejs", { jobsData: parsedJobData });
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs"); // Render an error page or handle the error accordingly
  }
});
router.get("/upload", async (req, res) => {
  res.render("form");
});
router.post("/upload", async (req, res) => {
  try {
    // Create a new instance of the Upload model with data from the request body
    const newUpload = new Upload({
      name: req.body.name,
      role: req.body.role,
      contactNumber: req.body.contactNumber,
      location: req.body.location,
      salary: req.body.salary,
      description: req.body.description,
    });
    // Save the new upload to the database
    const savedUpload = await newUpload.save();
    console.log("Upload saved successfully:", savedUpload);
    res.redirect("/");
    // res.status(201).json({ message: "Upload successful", data: savedUpload });
  } catch (error) {
    console.error("Error handling form submission:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery.replace(/[^a-zA-Z0-9 ]/g, "");

    if (!searchQuery) {
      res.status(400).json({ error: "Search query is required." });
      return;
    }

    const searchRegex = new RegExp(searchQuery, "i");

    // Use aggregation to unwind and match the matching elements in the total array
    const searchResults = await Job.aggregate([
      {
        $unwind: "$total",
      },
      {
        $match: {
          $or: [
            { "total.jobName": searchRegex },
            { "total.description": searchRegex },
            { "total.salary": searchRegex },
            { "total.ownerName": searchRegex },
            { "total.contactNumber": searchRegex },
            { "total.location": searchRegex },
            { "total.createdTime": searchRegex },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          matchedJobs: { $push: "$total" },
        },
      },
    ]);

    // Extract all matched jobs from the result
    const matchedJobs = searchResults
      .map((result) => result.matchedJobs)
      .flat();

    let value = {
      name: searchQuery,
      jobs: matchedJobs,
      totalAvailableJobs: matchedJobs.length,
    };

    res.render("show.ejs", { jobsData: value });
  } catch (error) {
    console.error("Error while searching:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/view", async (req, res) => {
  try {
    let temp = await Upload.find({});
    res.render("viewProfile", { jobsData: temp });
  } catch (error) {
    console.error("Error handling form submission:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
