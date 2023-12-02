const mongoose = require("mongoose");
const Review = require("./reviews");
const spotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: String,
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  activities: {
    type: [String],
    required: true,
  },
  dogFriendly: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  author: { //relationship between author and spot
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //'User' Model -> the author contain an ObjectId that corresponds to a document in User collection
  },
  reviews: [
    //Array of Objects Ids (review) for each campground
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review", //'Review' Model
    },
  ],
});

//MONGOOSE MIDDLEWARE -> triggered after findOneAndDelete of a spot
spotSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      //deleting all reviews where their Id field is in the doc that was deleted
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

//MODEL
const Spot = mongoose.model("Spot", spotSchema);

module.exports = Spot;
