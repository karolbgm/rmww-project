const express = require("express");
const router = express.Router({ mergeParams: true }); //I'll have access to :id param now
const Review = require("../models/reviews");
const Spot = require("../models/spots");

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    req.flash("error", "Please Log in to access this page.");
    res.redirect("/sessions/new");
  }
};
const isAuthorOfReview = async (req, res, next) => {
  const rId = req.params.rId;
  const id = req.params.id;
  const review = await Review.findById(rId);
  if (!review.author.equals(req.session.currentUser._id)) {
    req.flash(
      "error",
      "Access denied. Please ensure you are signed in with the correct account."
    );
    return res.redirect(`/spots/${id}`);
  }
  next();
};

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const spot = await Spot.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.session.currentUser._id;
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    res.redirect(`/spots/${spot.id}`);
  } catch (e) {
    next(e);
  }
});

router.delete(
  "/:rId",
  isAuthenticated,
  isAuthorOfReview,
  async (req, res, next) => {
    try {
      const { id, rId } = req.params;
      await Spot.findByIdAndUpdate(id, { $pull: { reviews: rId } }); //it's going to take the review Id and pull it out of reviews(array of Ids)
      await Review.findByIdAndDelete(req.params.rId); //then we delete entire review
      res.redirect(`/spots/${id}`);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
