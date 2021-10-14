const express = require('express');

const reviewController = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.setProduct, reviewController.getAllReviews)
  .post(reviewController.setProduct, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
