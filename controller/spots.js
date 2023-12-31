const express = require("express");
const router = express.Router(); //creates new router object to be used in my main application
const Spot = require("../models/spots");

//MIDDLEWARE FUNCTIONS
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next(); //next middleware or route handler in the stack
  } else {
    req.flash("error", "Please Log in to access this page."); //(type, message) -> displayed in my boilerplate (views)
    res.redirect("/sessions/new");
  }
};
//This function will not allow delete/edit spot 
const isAuthor = async (req, res, next) => {
  const id = req.params.id;
  const spot = await Spot.findById(id);
  if (!spot.author.equals(req.session.currentUser._id)) {
    req.flash("error", "Access denied. Please ensure you are signed in with the correct account."
    );
    return res.redirect(`/spots/${id}`);
  }
  next();
};

//I.N.D.U.C.E.S ROUTES

//INDEX
router.get("/", async (req, res, next) => {
  try {
    const allSpots = await Spot.find({});
    res.render("index.ejs", {
      spots: allSpots,
      currentUser: req.session.currentUser,
    });
  } catch (e) {
    next(e); //pass the error to my generic error handler
  }
});

//NEW
router.get("/new", isAuthenticated, (req, res) => {
  res.render("new.ejs", { currentUser: req.session.currentUser });
});

//DELETE
router.delete("/:id", isAuthenticated, isAuthor, async (req, res, next) => {
  try {
    await Spot.findByIdAndDelete(req.params.id);
    req.flash("success", "Spot deleted!");
    res.redirect("/spots");
  } catch (e) {
    next(e);
  }
});

//UPDATE
router.put("/:id", isAuthenticated, isAuthor, async (req, res, next) => {
  try {
    if (req.body.dogFriendly === "on") {
      req.body.dogFriendly = true;
    } else {
      req.body.dogFriendly = false;
    }
    // Split activities and trim whitespace
    req.body.activities = req.body.activities
      .split(",") //split string into array of strings
      .map((activity) => activity.trim()); //loops over array and removes whitespace
    const updatedSpot = await Spot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    req.flash("success", "Spot updated!");
    res.redirect(`/spots/${updatedSpot.id}`);
  } catch (e) {
    next(e);
  }
});

//CREATE
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    if (req.body.dogFriendly === "on") {
      req.body.dogFriendly = true;
    } else {
      req.body.dogFriendly = false;
    }
    // Split activities and trim whitespace
    req.body.activities = req.body.activities
      .split(",")
      .map((activity) => activity.trim());
    const spot = await Spot.create(req.body);
    spot.author = req.session.currentUser._id;
    await spot.save();
    req.flash("success", "New spot created!");
    res.redirect("/spots");
  } catch (e) {
    next(e);
  }
});

//EDIT
router.get("/:id/edit", isAuthenticated, isAuthor, async (req, res, next) => {
  try {
    const foundSpot = await Spot.findById(req.params.id);
    res.render("edit.ejs", {
      spot: foundSpot,
      currentUser: req.session.currentUser,
    });
  } catch (e) {
    next(e);
  }
});

//SHOW
router.get("/:id", async (req, res, next) => {
  try {
    const spot = await Spot.findById(req.params.id)
      .populate({ 
        path: "reviews", //populate/retrieve all the reviews from the reviews array
        populate: { //nested populate
          path: "author", //then populate in each review, their author
        },
      })
      .populate("author"); //populate the one author of this spot
    console.log(spot);
    res.render("show.ejs", {
      spot: spot,
      currentUser: req.session.currentUser,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
