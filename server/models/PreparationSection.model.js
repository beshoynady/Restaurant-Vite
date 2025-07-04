const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const PreparationSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Section name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Section name must be at least 3 characters long'],
    maxlength: [50, 'Section name must be at most 50 characters long'],
  },
  createdBy: {
    type: ObjectId,
    ref: 'Employee',
    required: [true, 'CreatedBy (Employee ID) is required'],
  },
  updatedBy: {
    type: ObjectId,
    ref: 'Employee',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, 
  versionKey: false,
});

PreparationSectionSchema.index({ name: 1 });

const PreparationSectionModel = mongoose.model('PreparationSection', PreparationSectionSchema);

module.exports = PreparationSectionModel;
