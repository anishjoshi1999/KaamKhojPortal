const Job = require("../Models/Job");
async function jobFilterMethod() {
  let jobs = await Job.find({});
  let driverJobs = [];
  let cookJobs = [];
  let houseJobs = [];
  let receptionJobs = [];
  let salesJobs = [];
  let otherJobs = [];

  jobs[0].total.forEach((job) => {
    const lowerCaseJobName = job.jobName.toLowerCase();

    if (lowerCaseJobName.includes("driver")) {
      driverJobs.push(job);
    } else if (lowerCaseJobName.includes("cook")) {
      cookJobs.push(job);
    } else if (/\bsale(s)?\b/.test(lowerCaseJobName)) {
      salesJobs.push(job);
    } else if (
      lowerCaseJobName.includes("help") ||
      lowerCaseJobName.includes("maid")
    ) {
      houseJobs.push(job);
    } else if (lowerCaseJobName.includes("recept")) {
      receptionJobs.push(job);
    } else {
      otherJobs.push(job);
    }
  });
  let jobInformation = [
    {
      name: "Driving Jobs",
      totalAvailableJobs: driverJobs.length,
      jobs: driverJobs,
    },
    {
      name: "Cook and Maid Jobs",
      totalAvailableJobs: cookJobs.length,
      jobs: cookJobs,
    },
    {
      name: "Sales Jobs",
      totalAvailableJobs: salesJobs.length,
      jobs: salesJobs,
    },
    {
      name: "Household Jobs",
      totalAvailableJobs: houseJobs.length,
      jobs: houseJobs,
    },
    {
      name: "Reception Jobs",
      totalAvailableJobs: receptionJobs.length,
      jobs: receptionJobs,
    },
    {
      name: "Other Jobs",
      totalAvailableJobs: otherJobs.length,
      jobs: otherJobs,
    },
  ];
  return jobInformation;
}

module.exports = { jobFilterMethod };
