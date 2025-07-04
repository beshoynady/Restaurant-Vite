const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the schema for the Reservation model
const ReservationSchema = new Schema(
    {
        // Table number for the reservation
        tableId: {
            type: Schema.Types.ObjectId,
            ref: 'Table',
            required: true,
        },
        tableNumber: {
            type: String,
            required: [true, 'number of tables required'],
        },
        // User ID referencing the user who made the reservation
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        // Customer name for the reservation
        customerName: {
            type: String,
            required: true,
        },
        // Customer phone number for the reservation
        customerPhone: {
            type: String, 
            required: true,
        },
        // Number of guests for the reservation
        numberOfGuests: {
            type: Number,
            required: [true,'Number of guests for the reservation required'], 
            default: 1,
            min: 1,
            max: 10, // Adjust as needed
        },
        // Date of the reservation
        reservationDate: {
            type: Date,
            required: true,
        },
        // Start time of the reservation
        startTime: {
            type: Date,
            required: true,
        },
        // End time of the reservation
        endTime: {
            type: Date,
            required: true,
        },
        reservationNote: {
            type: String,
            maxLength: 255,
        },
        // Employee ID referencing the employee who created the reservation
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
        },
        updateBy: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
        },
        // Reservation status: awaiting confirmation, confirmed, canceled, Missed reservation time
        status: {
            type: String,
            enum: ['awaiting confirmation', 'confirmed', 'canceled', 'Missed reservation time', 'client arrived'],
            default: 'awaiting confirmation'
        }
    },
    {
        timestamps: true,
    }
);

// Define the Reservation model
const ReservationModel = mongoose.model('Reservation', ReservationSchema);

// Export the Reservation model
module.exports = ReservationModel;
