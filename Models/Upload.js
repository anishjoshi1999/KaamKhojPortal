const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["jobProvider", "jobSeeker"],
  },
  contactNumber: {
    type: String,
    unique: true,
  },
  location: {
    type: String,
  },
  salary: {
    type: String,
  },
  description: {
    type: String,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
});

const Upload = mongoose.model("Upload", uploadSchema);

module.exports = Upload;
