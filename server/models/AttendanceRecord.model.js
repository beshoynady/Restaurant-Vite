const mongoose = require('mongoose');

const { Schema } = mongoose;



const attendanceRecordSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true
    },
    shift: {
      type: Schema.Types.ObjectId,
      ref: 'Shift',
      required: true,
    },
    currentDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ['Attendance', 'Absence', 'Vacation'],
      required: true,
      default: 'Attendance'
    },
    arrivalDate: {
      type: Date,
      required: false,
      index: true
    },
    departureDate: {
      type: Date,
      required: false,
    },
    isOvertime: {
      type: Boolean,
      default: false,
    },
    overtimeMinutes: {
      type: Number,
      default: 0,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    lateMinutes: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    }
  },
  { timestamps: true }
);

const AttendanceRecordModel = mongoose.model('AttendanceRecord', attendanceRecordSchema);

module.exports = AttendanceRecordModel;
