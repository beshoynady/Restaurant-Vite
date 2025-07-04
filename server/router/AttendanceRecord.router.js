const express = require('express');
const router = express.Router();
const {
  createAttendanceRecord,
  getAllAttendanceRecords,
  getAttendanceRecordById,
  updateAttendanceRecordById,
  deleteAttendanceRecordById
} = require('../controllers/Attendance.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')


router.route('/')
  .post(authenticateToken, checkSubscription, createAttendanceRecord)
  .get(authenticateToken, checkSubscription, getAllAttendanceRecords);

router.route('/:id')
  .get(authenticateToken, checkSubscription, getAttendanceRecordById)
  .put(authenticateToken, checkSubscription, updateAttendanceRecordById)
  .delete(authenticateToken, checkSubscription, deleteAttendanceRecordById);

module.exports = router;
