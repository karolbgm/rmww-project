const bcrypt = require("bcrypt"); //hash function
const express = require("express");
const sessions = express.Router();
const User = require("../models/users");

//LOG IN
sessions.get("/new", (req, res) => {
  res.render("sessions/new.ejs", {
    currentUser: req.session.currentUser,
  });
});

//SIGINING IN
sessions.post("/", async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });

    if (
      foundUser &&
      bcrypt.compareSync(req.body.password, foundUser.password) //if there is a user and the password matches -> compareSync (compares text to hashed password)
    ) {
      req.session.currentUser = foundUser;
      req.flash("success", "Login successful!");
      // console.log(foundUser);
      res.redirect("/spots");
    } else {
      req.flash("error", "Incorrect username or password.");
      res.redirect("/sessions/new");
    }
  } catch (e) {
    console.error(e);
    req.flash("error", "An error occurred during login.");
    res.redirect("/sessions/new");
  }
});

//LOG OUT
sessions.delete("/", (req, res) => {
  req.session.destroy(() => {
    console.log("Session destroyed successfully");
    res.redirect("/spots");
  });
});

module.exports = sessions;
