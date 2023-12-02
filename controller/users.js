const bcrypt = require("bcrypt");
const express = require("express");
const users = express.Router();
const User = require("../models/users.js");

//SIGN UP
users.get("/new", (req, res) => {
  res.render("users/new.ejs", {
    currentUser: req.session.currentUser,
  });
});

//SIGNING UP - CREATE A USER
users.post("/", async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );
    const user = await User.create(req.body);
    console.log(user);
    req.flash("success", "User created!");
    res.redirect("/spots");
  } catch (e) {
    req.flash(
      "error",
      "Sorry, this username is already taken. Please choose another one."
    );
    res.redirect("/users/new");
  }
});

module.exports = users;
