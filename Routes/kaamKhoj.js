const express = require("express");
const router = express.Router();
const { fetchData } = require("../utils/minimalJob");

router.get("/jobs", async (req, res) => {
  await fetchData();
  res.redirect("/");
});

module.exports = router;
