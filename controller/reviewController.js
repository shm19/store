const reviewModel = require('../models/reviewModel');
const handleFactory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = handleFactory.getAll(reviewModel);
exports.getReview = handleFactory.getOne(reviewModel);
exports.createReview = handleFactory.createOne(reviewModel);
exports.deleteReview = handleFactory.deleteOne(reviewModel);
exports.updateReview = handleFactory.updateOne(reviewModel);

exports.setProduct = catchAsync(async (req, res, next) => {
  if (req.params.productId) {
    req.filter = { product: req.params.productId };
    req.body.product = req.params.productId;
  }
  next();
});
