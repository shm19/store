const mongoose = require('mongoose');
const schemaOption = require('../utils/schemaOptoin');

const extraSchema = new mongoose.Schema(
  {
    name: schemaOption.nameObj('Extra'),
    price: {
      type: Number,
      required: [true, 'Each extra item should have a price']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

extraSchema.methods.toJSON = function() {
  const extra = this.toObject();
  delete extra.__v;
  return extra;
};

const extraModel = mongoose.model('Extra', extraSchema);

module.exports = extraModel;
