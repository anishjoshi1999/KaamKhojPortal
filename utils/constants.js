// constants.js
const dotenv = require("dotenv");
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  jwtSecret,
  PORT,
  MONGODB_URI,
};
