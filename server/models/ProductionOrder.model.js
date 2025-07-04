const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productionOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      required: [true, "Production number is required"],
    },
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    preparationSection: {
      type: ObjectId,
      ref: "PreparationSection",
      required: [true, "preparation section is required"],
    },
    stockItem: {
      type: ObjectId,
      ref: "StockItem",
      required: [true, "Stock item is required"],
    },
    unit: {
      type: String,
      trim: true,
      required: [true, "Unit is required"],
    },
    quantityRequested: {
      type: Number,
      required: [true, "Quantity requested is required"],
      min: [1, "Quantity must be at least 1"],
    },
    productionStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Canceled", "Rejected"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: [true, "Created by is required"],
    },
    updatedBy: {
      type: ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("ProductionOrder", productionOrderSchema);
