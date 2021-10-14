const extraModel = require('../models/extraModel');
const handleFactory = require('./handleFactory');

exports.getAllExtras = handleFactory.getAll(extraModel);
exports.getExtra = handleFactory.getOne(extraModel);
exports.createExtra = handleFactory.createOne(extraModel);
exports.deleteExtra = handleFactory.deleteOne(extraModel);
exports.updateExtra = handleFactory.updateOne(extraModel);
