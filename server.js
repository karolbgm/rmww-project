//DEPENDENCIES
const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const db = mongoose.connection; //default connection object

//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")); 

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
    Spot.find({}, (err, allSpots) => {
        if (err) {
            console.log(err.message)
        }
        res.render("index.ejs", {spots: allSpots})
    })
})

//NEW
app.get("/spots/new", (req, res) => {
    res.render("new.ejs")
})

//DELETE
app.delete("/spots/:id", (req, res) => {
    Spot.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err.message)
        }
        res.redirect("/spots")
    })
})

//UPDATE
app.put("/spots/:id", (req, res) => {
   Spot.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedSpot) => {
    if (err) {
        console.log(err.message)
    }
    res.redirect(`/spots/${updatedSpot.id}`)
   })
})

//CREATE
app.post("/spots", (req, res) => {
    Spot.create(req.body, (err, newSpot) => {
        if (err){
            console.log(err.message)
        }
        res.redirect("/spots/")
    })
})

//EDIT
app.get("/spots/:id/edit", (req, res) => {
    Spot.findById(req.params.id, (err, foundSpot) => {
        res.render("edit.ejs", {spot: foundSpot})
    })
})

//SHOW
app.get("/spots/:id", (req, res) => {
    Spot.findById(req.params.id, (err, spot) => {
        res.render("show.ejs", {spot: spot})
    })
})





//SERVER UP AND RUNNING
app.listen(PORT, () => {
  console.log("Listening to port: ", PORT);
});
