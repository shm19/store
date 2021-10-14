const mongoose = require('mongoose');
const slugify = require('slugify');
const schemaOption = require('../utils/schemaOptoin');

const productSchema = new mongoose.Schema(
  {
    name: schemaOption.nameObj('Product'),
    price: {
      type: Number,
      required: [true, 'Each product should have a price']
    },
    inventory: Number,
    photo: String,
    slug: String,
    features: [
      {
        name: schemaOption.nameObj('Feature'),
        addionalPrice: Number,
        decreaseInventory: Number
      }
    ],
    extra: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Extra'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// virtual population
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

productSchema.virtual('totalPrice').get(function() {
  let total = this.price;
  if (this.features) {
    // eslint-disable-next-line no-return-assign
    this.features.forEach(el => (total += el.addionalPrice || 0));
    // eslint-disable-next-line no-return-assign
    this.extra.forEach(el => (total += el.price || 0));
  }
  return total;
});

productSchema.virtual('totalInventory').get(function() {
  let total = this.inventory;
  if (this.features)
    // eslint-disable-next-line no-return-assign
    this.features.forEach(el => (total -= el.decreaseInventory || 0));

  return total;
});

productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.methods.toJSON = function() {
  const product = this.toObject();
  delete product.__v;
  return product;
};

const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;
