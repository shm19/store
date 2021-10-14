const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: String,
    required: [true, 'review should have a reviewer']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Review should have a product']
  },
  review: {
    type: String,
    required: [true, 'Review can not be empty']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review should have a rating']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

reviewSchema.pre(/^find/, function(next) {
  this.populate('product');
  next();
});

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;
