const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const categoryStockSchema = new mongoose.Schema({
  categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,  
      trim: true,
      maxlength: 50,
      minlength: 3,
  },
  categoryCode: {
      type: String,
      trim: true,
      required: [true, 'Category code is required'],
      unique: true,
  },
  createdBy: {
      type: ObjectId,
      ref: 'Employee',
      required: [true, 'Creator is required'],
  },
  notes: {
      type: String,
      trim: true,
  },
}, { timestamps: true });


const CategoryStockmodel = mongoose.model('CategoryStock', categoryStockSchema)

module.exports = CategoryStockmodel