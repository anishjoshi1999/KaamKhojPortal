const express = require("express");
const Job = require("../Models/Job");
const Upload = require("../Models/Upload");
const { jobFilterMethod } = require("../utils/filterMethod");
const router = express.Router();

router.get("/jobs", async (req, res) => {
  try {
    let jobsData = await jobFilterMethod();
    res.render("kaamkhoj.ejs", { jobsData, userAuthenticated: req.userId });
  } catch (error) {
    res.render("error");
  }
});

router.post("/jobs", async (req, res) => {
  try {
    const { jobData } = req.body;
    const parsedJobData = JSON.parse(jobData);
    res.render("show.ejs", {
      jobsData: parsedJobData,
      userAuthenticated: req.userId,
    });
  } catch (error) {
    res.render("error");
  }
});
router.get("/upload", async (req, res) => {
  res.render("form", { userAuthenticated: req.userId });
});
router.post("/upload", async (req, res) => {
  try {
    const availability = req.body.availability === "true";
    // Create a new instance of the Upload model with data from the request body
    const newUpload = new Upload({
      name: req.body.name,
      role: req.body.role,
      specificJob: req.body.specificJob,
      contactNumber: req.body.contactNumber,
      location: req.body.location,
      salary: req.body.salary,
      description: req.body.description,
      availability: availability,
    });
    // Save the new upload to the database
    let temp = await newUpload.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("error");
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

    res.render("show.ejs", { jobsData: value, userAuthenticated: req.userId });
  } catch (error) {
    res.render("error");
  }
});

router.get("/view", async (req, res) => {
  try {
    let temp = await Upload.find({});
    res.render("viewProfile", {
      jobsData: temp,
      userAuthenticated: req.userId,
    });
  } catch (error) {
    res.render("error");
  }
});
router.get("/view/:id", async (req, res) => {
  const { id } = req.params;
  let docs = await Upload.findById(id);
  const {
    _id,
    name,
    role,
    specificJob,
    availability,
    contactNumber,
    location,
    salary,
    description,
  } = docs;
  res.render("editviewProfile", {
    _id,
    name,
    role,
    specificJob,
    availability,
    contactNumber,
    location,
    salary,
    description,
    userAuthenticated: req.userId,
  });
});

router.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      availability,
      contactNumber,
      location,
      salary,
      description,
    } = req.body;
    // Assuming availability is a boolean, convert it to a boolean value
    const isAvailable = availability === "true";
    // Assuming you have a model named Upload
    const updatedJob = await Upload.findByIdAndUpdate(
      id,
      {
        name: name,
        role: role,
        availability: isAvailable,
        contactNumber: contactNumber,
        location: location,
        salary: salary,
        description: description,
      },
      { new: true } // Return the updated document
    );
    // You can redirect the user to another page or send a response accordingly
    res.redirect("/api/view");
  } catch (error) {
    res.render("error");
  }
});
router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Upload.findByIdAndDelete(id);
    res.redirect("/api/view");
  } catch (error) {
    res.render("error");
  }
});
module.exports = router;
