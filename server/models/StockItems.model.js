const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const StockItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      trim: true,
      required: [true, "Item name is required."],
      unique: true,
      maxLength: [100, "Item name must not exceed 100 characters."],
    },
    SKU: {
      type: String,
      trim: true,
      required: [true, "SKU (Stock Keeping Unit) is required."],
      unique: true,
      maxLength: [50, "SKU must not exceed 50 characters."],
    },
    stores: [
      {
        type: ObjectId,
        ref: "Store",
        required: [true, "Store ID is required."],
      },
    ],
    categoryId: {
      type: ObjectId,
      ref: "CategoryStock",
      required: [true, "Category ID is required."],
    },
    storageUnit: {
      type: String,
      required: [true, "Storage unit is required."],
      trim: true,
    },
    parts: {
      type: Number,
      required: [true, "Number of parts is required."],
      min: [1, "Parts must be at least 1."],
    },
    ingredientUnit: {
      type: String,
      required: [true, "Ingredient unit is required."],
      trim: true,
    },
    minThreshold: {
      type: Number,
      default: 0,
      min: [0, "Minimum threshold cannot be negative."],
    },
    maxThreshold: {
      type: Number,
      default: 0,
      min: [0, "Maximum threshold cannot be negative."],
    },
    reorderQuantity: {
      type: Number,
      default: 0,
      min: [0, "Reorder quantity cannot be negative."],
      // Quantity to reorder when stock falls below the minimum threshold.
    },
    costMethod: {
      type: String,
      enum: ["FIFO", "LIFO", "Weighted Average"],
      required: [true, "Cost method is required."],
    },
    costPerPart: {
      type: Number,
      default: 0,
      min: [0, "Cost per part cannot be negative."],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, "Active status is required."],
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: [true, "Created by is required."],
    },
    updatedBy: {
      type: ObjectId,
      ref: "Employee",
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [500, "Notes must not exceed 500 characters."],
    },
  },
  {
    timestamps: true,
  }
);

StockItemSchema.index({ itemName: 1 });
StockItemSchema.index({ SKU: 1 });
StockItemSchema.index({ categoryId: 1 });
StockItemSchema.index({ "stores.storeId": 1 });

const StockItemModel = mongoose.model("StockItem", StockItemSchema);
module.exports = StockItemModel;
