const express = require('express');
// const handleFactory = require('../controller/handleFactory');
// const authController = require('../controller/authController');
const extraController = require('../controller/extraController');

const router = express.Router();

// only admins are suppose to do CRUD options
// router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/')
  .get(extraController.getAllExtras)
  .post(extraController.createExtra);

router
  .route('/:id')
  .get(extraController.getExtra)
  .patch(extraController.updateExtra)
  .delete(extraController.deleteExtra);

module.exports = router;
