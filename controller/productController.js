const handleFactory = require('./handleFactory');
const productModel = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = handleFactory.getAll(productModel);
exports.getProduct = handleFactory.getOne(productModel, ['reviews', 'extra']);
exports.createProduct = handleFactory.createOne(productModel);
exports.deleteProduct = handleFactory.deleteOne(productModel);
exports.updateProduct = handleFactory.updateOne(productModel);

exports.setPhoto = catchAsync(async (req, res, next) => {
  const product = await productModel.findByIdAndUpdate(
    req.params.productId,
    { photo: req.file.filename },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});
