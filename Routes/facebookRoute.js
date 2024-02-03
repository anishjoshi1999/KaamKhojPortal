const express = require("express");
const axios = require("axios");
const { ACCESS_TOKEN, FACEBOOK_PAGE } = require("../utils/constants");
const router = express.Router();
const { fetchData } = require("../utils/minimalJob");
const Job = require("../Models/Job");

router.get("/", async (req, res) => {
  try {
    const facebookPageURI = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE}/posts?access_token=${ACCESS_TOKEN}&fields=id,permalink_url,message,comments,likes,full_picture,created_time&limit=20`;
    const response = await axios.get(facebookPageURI);
    const { data } = response.data;
    res.render("facebook", { data });
  } catch (error) {
    console.error(error);
    res.render("error");
  }
});

router.get("/post", async (req, res) => {
  //Update the database
  await fetchData();
  //find the latest Job
  let jobs = await Job.find({});
  console.log(jobs);
  let randomJobs = getRandomObjects(jobs[0].total);
  let uniqueJobs = filterUniqueJobs(randomJobs);
  const combinedNews = uniqueJobs
    .map((element, index) => {
      return `Position ${index + 1}:  ${element.jobName.trim()}, Salary: Rs ${
        element.salary
      } Per Month\n`;
    })
    .join("");

  const facebookResponse = await postNewsToFacebook(combinedNews);
  console.log("Automatic post request triggered:", facebookResponse.data);
  res.redirect("/");
});
// Function to filter out unique jobs based on jobName
function filterUniqueJobs(jobs) {
  // Create a set to store unique job names
  const uniqueJobNames = new Set();

  // Use filter to get only unique jobs
  const uniqueJobs = jobs.filter((job) => {
    // Check if the jobName is not in the set
    if (!uniqueJobNames.has(job.jobName)) {
      // Add jobName to the set
      uniqueJobNames.add(job.jobName);
      // Return true to include the job in the filtered array
      return true;
    }
    // Return false to exclude duplicate jobNames
    return false;
  });

  return uniqueJobs;
}
async function postNewsToFacebook(sources) {
  const facebookUrl = `https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/feed`;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  // Construct the formatted date and time string
  const caption = `Urgent Manpower Wanted!!! \n\n${sources} \nजनकारीका लागी 9865645065, 9863679399 अथवा हामीसँग Messenger मार्फत सम्पर्क गर्नु होला।`;

  const data = {
    message: caption,
    //link: "your_url"
    access_token: accessToken,
    published: true,
  };
  try {
    const response = await axios.post(facebookUrl, data);
    return response;
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}
function getRandomObjects(array) {
  // Clone the array to avoid modifying the original array
  const shuffledArray = [...array];

  // Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Return the first three elements
  return shuffledArray.slice(0, 5);
}
module.exports = router;
