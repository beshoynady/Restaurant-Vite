const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productionRecordSchema = new mongoose.Schema(
  {
    productionNumber: {
      type: Number,
      required: [true, "Production number is required"],
    },
    productionOrder: {
      type: ObjectId,
      ref: "ProductionOrder",
      required: [true, "Production order is required"],
    },
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    stockItem: {
      type: ObjectId,
      ref: "StockItem",
      required: [true, "Stock item is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    unit: {
      type: String,
      trim: true,
      maxLength: 10,
      required: [true, "Unit is required"],
    },
    productionStatus: {
      type: String,
      enum: ["Pending", "Completed", "Canceled", "Rejected"],
      default: "Pending",
    },
    preparationSection: {
      type: ObjectId,
      ref: "PreparationSection",
      required: [true, "Production section is required"],
    },
    recipe: {
      type: ObjectId,
      ref: "ProductionRecipe",
      required: [true, "Stock Production Recipe is required"],
    },
    materialsUsed: [
      {
        material: {
          type: ObjectId,
          ref: "StockItem",
          required: [true, "Material is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
        cost: {
          type: Number,
          required: [true, "Cost is required"],
        },
      },
    ],
    productionCost: {
      type: Number,
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
    notes: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    productionStartTime: {
      type: Date,
      required: [true, "Production start time is required"],
      default: Date.now,
    },
    productionEndTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("ProductionRecord", productionRecordSchema);
