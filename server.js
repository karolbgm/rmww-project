//DEPENDENCIES
const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const db = mongoose.connection; //default connection object

//MODELS
const Spot = require("./models/spots");
const seedData = require("./models/seed.js");

//CONFIG
const mongoURI = "mongodb://localhost:27017/spots";

//CONNECT TO MONGO
mongoose.connect(mongoURI, () => {
  console.log("The connection with mongod is established");
});

// ERROR/SUCCESS
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", mongoURI));
db.on("disconnected", () => console.log("mongo disconnected"));
db.on("open", () => {
  console.log("Mongoose connection is open");
//   Spot.create(seedData, (err, data) => {
//     if (err) {
//         console.log(err.message)
//     }
//     console.log('added seed data')
//   })
});


//I.N.D.U.C.E.S ROUTES

//INDEX
app.get("/spots", (req, res) => {
    Spot.find({}, (err, data) => {
        if (err) {
            console.log(err.message)
        }
        res.render("index.ejs", {spots: data})
    })
})

//NEW
// app.get("/spots/new", (req, res) => {
//     res.send("It works!")
// })

//DELETE
// app.delete("/spots/:id", (req, res) => {
//     res.send("It works!")
// })

//UPDATE
// app.put("/spots/:id", (req, res) => {
//     res.send("It works!")
// })

//CREATE
// app.post("/spots", (req, res) => {
//     res.send("It works!")
// })

//EDIT
// app.get("/spots/:id/edit", (req, res) => {
//     res.send("It works!")
// })

//SHOW
// app.get("/spots/:id", (req, res) => {
//     res.send("It works!")
// })





//SERVER UP AND RUNNING
app.listen(PORT, () => {
  console.log("Listening to port: ", PORT);
});
