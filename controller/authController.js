const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signJwt = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const createAndSendJwt = (user, res) => {
  // creating jsonweb token
  const token = signJwt(user._id);

  // setting jwt on cookie
  res.cookie('jwt', token, {
    expiresIn:
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    usehttp: true
  });

  // stop password leaking
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

module.exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  createAndSendJwt(user, res);
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 401));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('invalid email or password', 401));
  }

  createAndSendJwt(user, res);
});

module.exports.protect = catchAsync(async (req, res, next) => {
  // if (!req.headers.authorization && !req.cookies.jwt) {
  if (!req.headers.authorization) {
    return next(new AppError('invalid authorization', 401));
  }

  // const token = req.cookies.jwt || req.headers.authorization.split(' ')[1];
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(new AppError('You are not logged In', 401));
  }
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id);

  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  req.user = user;
  return next();
});

module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

module.exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new AppError(`Wrong password`, 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createAndSendJwt(user, res);
});

module.exports.forgotpassword = async (req, res, next) => {
  // 1) get user
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      return next(new AppError('there is no user with this email', 401));
    }
    // 2) create reset token and save hashed reeset token in db
    const resetToken = await user.createPasswordRestToken();
    await user.save({ validateBeforeSave: false });
    // 3) send reset token using email
    await sendEmail({
      rom: 'StoreAdmin@gmail.com',
      to: user.email,
      subject: 'Password reset token',
      text: resetToken
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset token send to your email address'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
};

module.exports.resetpassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();
  createAndSendJwt(user, res);
});
