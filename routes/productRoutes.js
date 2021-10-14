const express = require('express');
const authController = require('../controller/authController');
const productController = require('../controller/productController');
const reviewRouter = require('./reviewRoutes');
const multerFactory = require('../controller/multerFactory');

const router = express.Router();

// only admins are suppose to do CRUD options
router.use(authController.protect, authController.restrictTo('admin'));

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

router.patch(
  '/uploadePhoto/:productId',
  multerFactory.uploadeUserPhoto,
  multerFactory.resizeuserPhoto('product'),
  productController.setPhoto
);

module.exports = router;
