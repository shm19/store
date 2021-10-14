const handleFactory = require('./handleFactory');
const productModel = require('../models/productModel');

exports.getAllProducts = handleFactory.getAll(productModel);
exports.getProduct = handleFactory.getOne(productModel, ['reviews', 'extra']);
exports.createProduct = handleFactory.createOne(productModel);
exports.deleteProduct = handleFactory.deleteOne(productModel);
exports.updateProduct = handleFactory.updateOne(productModel);
