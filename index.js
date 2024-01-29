// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret, PORT, MONGODB_URI } = require("./utils/constants");
// Load environment variables
dotenv.config();

// Import utility function to connect to MongoDB
const connectDB = require("./utils/connectDB");

// Create Express app
const app = express();

// Configure middleware
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
      mongoUrl: MONGODB_URI,
    }),
  })
);

// Import Routes
const kaamKhojRoute = require("./Routes/kaamKhoj");
const apiRoute = require("./Routes/apiRoute");

// Connect to MongoDB
connectDB(MONGODB_URI);

// Authentication Middleware
const { authMiddleware } = require("./Middleware/middleware");

// Admin Route
app.get("/auth", async (req, res) => {
  try {
    res.render("login.ejs", { userAuthenticated: req.userId });
  } catch (error) {
    console.log(error);
  }
});

// Authentication route
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

// Logout route
app.get("/logout", async (req, res) => {
  await res.clearCookie("token");
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

// API routes
app.use("/api", authMiddleware, apiRoute);

// KaamKhoj routes
app.use("/kaamkhoj", authMiddleware, kaamKhojRoute);

// 404 Route
app.use((req, res, next) => {
  res.status(404).render("error.ejs");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
