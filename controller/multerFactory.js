const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStroage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const uploade = multer({
  storage: multerStroage,
  fileFilter: multerFilter
});

exports.uploadeUserPhoto = uploade.single('photo');

exports.resizeuserPhoto = resource =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    const id = resource === 'product' ? req.params.productId : req.user.id;
    req.file.filename = `${resource}-${id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/${resource}s/${req.file.filename}`);

    next();
  });
