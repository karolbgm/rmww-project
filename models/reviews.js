const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    text: String,
    rating: Number
})

module.exports = mongoose.model("Review", reviewSchema)

//Schema for Review