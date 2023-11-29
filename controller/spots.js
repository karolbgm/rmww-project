const express = require("express");
const router = express.Router();
const Spot = require("../models/spots");


const isAuthenticated = (req, res, next) => {
    if(req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/new')
    }
}
//I.N.D.U.C.E.S ROUTES

//INDEX
router.get("/", async (req, res, next) => {
  try {
    const allSpots = await Spot.find({});
    res.render("index.ejs", { spots: allSpots,
        currentUser: req.session.currentUser });
  } catch (e) {
    next(e);
  }
});

//NEW
router.get("/new", isAuthenticated, (req, res) => {
  res.render("new.ejs", {currentUser: req.session.currentUser});
});

//DELETE
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    await Spot.findByIdAndDelete(req.params.id);
    req.flash('success', 'Spot deleted!')
    res.redirect("/spots");
  } catch (e) {
    next(e);
  }
});

//UPDATE
router.put("/:id", isAuthenticated, async (req, res, next) => {
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
    const updatedSpot = await Spot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    req.flash('success', 'Spot updated!')
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
    await spot.save();
    req.flash('success', 'New spot created!')
    res.redirect("/spots");
  } catch (e) {
    next(e);
  }
});

//EDIT
router.get("/:id/edit", isAuthenticated, async (req, res, next) => {
  try {
    const foundSpot = await Spot.findById(req.params.id);
    res.render("edit.ejs", { spot: foundSpot, currentUser: req.session.currentUser });
  } catch (e) {
    next(e);
  }
});

//SHOW
router.get("/:id", async (req, res, next) => {
  try {
    const spot = await Spot.findById(req.params.id).populate("reviews");
    res.render("show.ejs", { spot: spot, currentUser: req.session.currentUser });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
