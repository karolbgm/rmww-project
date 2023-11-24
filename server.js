//DEPENDENCIES
const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate') //I can create a layout file and include my partials in one place (boilerplate)
const methodOverride = require("method-override");
const db = mongoose.connection; //default connection object

//MIDDLEWARE
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")); 

//MODELS
const Spot = require("./models/spots");
const seedData = require("./models/seed.js");
const Review = require('./models/reviews.js')

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
app.get("/spots", async (req, res, next) => {
try{
    const allSpots = await Spot.find({})
    res.render("index.ejs", {spots: allSpots})
} catch (e) {
    next(e)
}
})

//NEW
app.get("/spots/new", (req, res) => {
    res.render("new.ejs")
})

//DELETE
app.delete("/spots/:id", async (req, res, next) => {
    try {
    await Spot.findByIdAndDelete(req.params.id)
    res.redirect("/spots")
    } catch (e) {
        next(e)
    }
})

//UPDATE
app.put("/spots/:id", async (req, res, next) => {
    try {
        if (req.body.dogFriendly === "on") {
            req.body.dogFriendly = true;
        } else {
            req.body.dogFriendly = false;
        }
        // Split activities and trim whitespace
        req.body.activities = req.body.activities.split(',').map(activity => activity.trim());
       const updatedSpot = await Spot.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
       res.redirect(`/spots/${updatedSpot.id}`)
    } catch (e) {
        next(e)
    }
})

//CREATE
app.post("/spots", async (req, res, next) => {
    try {
        if (req.body.dogFriendly === "on") {
            req.body.dogFriendly = true;
          } else {
            req.body.dogFriendly = false;
          }
        // Split activities and trim whitespace
        req.body.activities = req.body.activities.split(',').map(activity => activity.trim());
        const spot = await Spot.create(req.body)
        await spot.save()
        res.redirect('/spots')
    } catch (e) {
        next(e)
    }
})

//EDIT
app.get("/spots/:id/edit", async (req, res, next) => {
    try {
        const foundSpot = await Spot.findById(req.params.id)
        res.render("edit.ejs", {spot: foundSpot})
    } catch (e) {
        next(e)
    }
})

//SHOW
app.get("/spots/:id", async (req, res, next) => {
    try {
        const spot = await Spot.findById(req.params.id).populate('reviews')
        res.render("show.ejs", {spot: spot})
    } catch (e) {
        next(e)
    }
})

app.post('/spots/:id/reviews', async(req,res, next) => {
    try {
        const spot = await Spot.findById(req.params.id);
        const review = new Review(req.body)
        spot.reviews.push(review)
        await review.save()
        await spot.save()
        res.redirect(`/spots/${spot.id}`)
    } catch (e) {
        next(e)
    }
})

app.delete('/spots/:id/reviews/:rId', async (req,res, next) => {
    try {
        const {id, rId} = req.params
        await Spot.findByIdAndUpdate(id, {$pull: {reviews: rId}}) //it's going to take the review Id and pull it out of reviews(array of Ids)
        await Review.findByIdAndDelete(req.params.rId) //then we delete entire review
        res.redirect(`/spots/${id}`)
    } catch (e) {
        next(e)
    }
})

//ERROR HANDLER FOR ANY ERROR (BASIC)
app.use((err, req, res, next) => {
    res.send('Something went wrong!')
})

//SERVER UP AND RUNNING
app.listen(PORT, () => {
  console.log("Listening to port: ", PORT);
});
