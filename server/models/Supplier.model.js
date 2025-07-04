const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

// Supplier Schema
const SupplierSchema = new Schema(
  {
    // Supplier name
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensures no duplicate supplier names
      index: true, // Optimizes search queries
      maxlength: 255,
    },
    // Responsible person
    responsiblePerson: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    // Supplier contact information
    phone: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    whatsapp: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => !v || /\S+@\S+\.\S+/.test(v),
        message: "Please enter a valid email address",
      },
    },
    // Supplier address
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    // Items supplied by the supplier
    itemsSupplied: [
      {
        type: ObjectId,
        ref: "StockItem",
        default: [],
        required: true,
      },
    ],
    // Current balance of the supplier
    currentBalance: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    // Supplier payment type
    paymentType: {
      type: String,
      enum: ["Cash", "Installments"],
      required: true,
    },
    // Financial information
    financialInfo: [
      {
        paymentMethodName: {
          type: String,
          trim: true,
          maxlength: 100,
        },
        accountNumber: {
          type: String,
          trim: true,
          maxlength: 100,
        },
        currency: {
          type: String,
          trim: true,
          default: "EGP", // Default currency
          enum: ["USD", "EUR", "SAR", "EGP"], // You can extend this list
        },
      },
    ],
    // Additional notes about the supplier
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);


// Define the Supplier model
const SupplierModel = mongoose.model("Supplier", SupplierSchema);

// Export the Supplier model
module.exports = SupplierModel;
