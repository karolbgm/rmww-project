//REQUIRED DEPENDENCIES
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //I can create a layout file and include my partials in one place (boilerplate)
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const db = mongoose.connection; //default connection object

// ENV VARIABLES
const mongoURI = process.env.MONGOURI;
const PORT = process.env.PORT || 3000;

//MIDDLEWARE
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

//All my views will have access to this
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //res.locals pass local variables to the views
  res.locals.error = req.flash("error");
  next();
});

//MODELS
const Spot = require("./models/spots");
const seedData = require("./models/seed.js");
const Review = require("./models/reviews.js");

//CONTROLLER VARIABLES
const spotsController = require("./controller/spots.js");
const reviewsController = require("./controller/reviews.js");
const userController = require("./controller/users.js");
const sessionsController = require("./controller/sessions.js");

//CONNECT TO MONGO
mongoose.connect(mongoURI + "spots");

//ERROR/SUCCESS
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", mongoURI));
db.on("disconnected", () => console.log("mongo disconnected"));
db.on("open", () => {
  console.log("Mongoose connection is open");
  // Spot.create(seedData, (err, data) => {
  //   if (err) {
  //       console.log(err.message)
  //   }
  //   console.log('added seed data')
  // })
});

//CONTROLLER MIDDLEWARE
app.use("/spots", spotsController); //path and router
app.use("/spots/:id/reviews", reviewsController);
app.use("/users", userController);
app.use("/sessions", sessionsController);

//HOME PAGE
app.get("/", (req, res) => {
  const currentUser = req.session.currentUser;
  res.render("home.ejs", { currentUser });
});

//SEARCH BAR
app.get('/search', async (req, res) => {
  const {search_query} = req.query //extracting the search query
  const currentUser = req.session.currentUser; //retrieves currentUser from session
  const spots = await Spot.find({name: {$regex: search_query, $options: "i"}}) //regex allows me to search for part of word and options makes it case insensitive
  res.render("search.ejs", {spots, search_query, currentUser})
})

// ERROR HANDLER FOR ANY ERROR (BASIC)
app.use((err, req, res, next) => {
    res.send('Something went wrong!')
})

//SERVER UP AND RUNNING
app.listen(PORT, () => {
  console.log("Listening to port: ", PORT);
});
