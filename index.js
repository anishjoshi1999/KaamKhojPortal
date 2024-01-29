const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Middleware
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const app = express();

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Import Routes
const kaamKhojRoute = require("./Routes/kaamKhoj");
const apiRoute = require("./Routes/apiRoute");

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/auth");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.redirect("/auth");
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Admin Route
app.get("/auth", async (req, res) => {
  try {
    res.render("login.ejs", { userAuthenticated: req.userId });
  } catch (error) {
    console.log(error);
  }
});

app.post("/auth", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Home Route
app.get("/", authMiddleware, async (req, res) => {
  try {
    res.render("index.ejs", { userAuthenticated: req.userId });
  } catch (error) {
    console.error("Error fetching data from the API:", error.message);
    res.render("error.ejs");
  }
});

// Routes
app.use("/api", authMiddleware, apiRoute);
app.use("/kaamkhoj", authMiddleware, kaamKhojRoute);

// 404 Route
app.use((req, res, next) => {
  res.status(404).render("error.ejs");
});
