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
  dogFriendly: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
});

//MODEL
const Spot = mongoose.model("Spot", spotSchema);

module.exports = Spot;
