const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ConsumptionSchema = new mongoose.Schema(
  {
    section: {
      type: ObjectId,
      ref: "PreparationSection", // The preparation section receiving the items (e.g., Kitchen, Bar).
      required: true,
    },
    stockItem: {
      type: ObjectId,
      ref: "StockItem", // The stock item being transferred (e.g., Tomatoes, Cheese).
      required: true,
    },
    quantityTransferred: {
      type: Number, // The quantity of the stock item sent from the store or carried forward from the previous day.
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: "",
      require: true,
    },
    quantityConsumed: {
      type: Number, // The actual quantity consumed in the preparation section during the day.
      required: true,
      default: 0,
      min: 0,
    },
    bookBalance: {
      type: Number, // The actual remaining quantity after consumption, verified by physical count (stocktake).
      required: true,
      default: 0,
      min: 0,
    },
    actualBalance: {
      type: Number, // The actual remaining quantity.
      required: true,
      default: 0,
      min: 0,
    },
    adjustment: {
      type: Number, // The difference between theoretical balance (calculated) and actual balance (measured).
      required: true,
      default: 0,
    },
    adjustmentReason: {
      type: String, // Reason for discrepancies: waste, loss, or damage.
      enum: ["waste", "loss", "damage", "overage", null],
      default: null,
    },
    quantityRemaining: {
      type: Number, // The quantity remaining at the end of the day before deciding to carry forward or return to stock.
      required: true,
      default: 0,
      min: 0,
    },
    carriedForward: {
      type: Number, // The quantity carried forward to the next day's operations.
      required: true,
      default: 0,
      min: 0,
    },
    returnedToStock: {
      type: Number, // The quantity returned to the stockroom at the end of the day.
      default: 0,
      min: 0,
    },
    deliveredBy: {
      type: ObjectId,
      ref: "Employee", // The employee responsible for delivering the stock item.
      required: true,
    },
    receivedBy: {
      type: ObjectId,
      ref: "Employee", // The employee in the preparation section who received the stock item.
      required: true,
    },
    tickets: [
      {
        type: ObjectId,
        ref: "PreparationTicket", // Reference to the tickets executed in the section.
      },
    ],
    date: {
      type: Date, // The date of the record, representing a specific day of operation.
      required: true,
      default: Date.now,
    },
    remarks: {
      type: String, // Additional comments or notes about the record.
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to the record.
  }
);

const ConsumptionModel = mongoose.model("Consumption", ConsumptionSchema);

module.exports = ConsumptionModel;
