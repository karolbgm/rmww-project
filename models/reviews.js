const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    text: String,
    rating: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("Review", reviewSchema)

//Schema for Review