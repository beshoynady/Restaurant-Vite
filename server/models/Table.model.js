const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define the schema for the Table model
const TableSchema = new Schema(
  {
    // Section number where the table is located
    sectionNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 20,
    },
    // Table number
    tableNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1,
      maxlength: 20,
    },
    // Unique Table Code
    tableCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9]+$/.test(v);
        },
        message: "{VALUE} is not a valid table code",
      },
    },
    // Number of chairs at the table
    chairs: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 1,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "{VALUE} is not a valid number of chairs",
      },
    },
    // Whether the table is valid or not
    isValid: {
      type: Boolean,
      default: true,
      required: true,
    },
    // Table status
    status: {
      type: String,
      enum: [
        "Available",
        "Reserved",
        "Occupied",
        "Cleaning",
        "Maintenance",
        "Out of Service",
      ],
      default: "Available",
    },
    // Location of the table within the section
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    // Notes about the table
    notes: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    // User who created the table
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    // User who last updated the table
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Define the Table model
const TableModel = mongoose.model("Table", TableSchema);

// Export the Table model
module.exports = TableModel;
