const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();
// signup / login / update password / forget password / get me / update me

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotpassword);

router.patch('/resetpassword/:resetToken', authController.resetpassword);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/updateMyPassword', authController.updateMyPassword);

router.patch('/deleteMe', userController.deleteMe);

// updating user by itself
router.patch(
  '/updateMe',
  userController.uploadeUserPhoto,
  userController.resizeuserPhoto,
  userController.updateMe
);
// admin should have permission for this route
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
