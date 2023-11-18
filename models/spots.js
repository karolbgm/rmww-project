const mongoose = require("mongoose");

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
  accessibility: {
    type: String,
    enum: ["Easy", "Moderate", "Difficult"],
  },
  permitRequired: {
    type: Boolean,
    default: false,
  },
  dogFriendly: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

//MODEL
const Spot = mongoose.model("Spot", spotSchema);

module.exports = Spot;
