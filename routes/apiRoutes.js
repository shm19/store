const express = require('express');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const extraRouter = require('./extraRoutes');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/extras', extraRouter);
router.use('/reviews', reviewRouter);

module.exports = router;
