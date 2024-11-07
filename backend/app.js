const express = require("express");
const app = express();

// make cors to handle global request
const cors = require("cors");
app.use(cors({
  origin: ['http://localhost:3000',],
  credentials: true
}));

// upload files require handling
app.use("/api/v2/",express.static("uploads"));

// cookies handling
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());


// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));


// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// import routes
app.use("/hello", (req, res) => {
  res.send("Hello world!");
});

const taskRoutes = require('./routes/task.routes'); // Import shop routes
const userRoutes = require('./routes/user.routes'); // Import user routes
app.use("/api/v2/task", taskRoutes);
app.use("/api/v2/user", userRoutes);


// it's for ErrorHandling
const ErrorHandler = require("./middleware/error");
app.use(ErrorHandler);

// Export the app
module.exports = app;
