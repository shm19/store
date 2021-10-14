const express = require('express');
// const handleFactory = require('../controller/handleFactory');
// const authController = require('../controller/authController');
const productController = require('../controller/productController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// only admins are suppose to do CRUD options
// router.use(authController.protect, authController.restrictTo('admin'));

router.use('/:productId/reviews', reviewRouter);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
