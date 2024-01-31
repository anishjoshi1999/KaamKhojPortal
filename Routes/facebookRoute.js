const express = require("express");
const axios = require("axios");
const { ACCESS_TOKEN, FACEBOOK_PAGE } = require("../utils/constants");
const router = express.Router();

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

module.exports = router;
