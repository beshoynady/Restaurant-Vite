const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const StockMovementSchema = new mongoose.Schema(
  {
    storeId: {
      type: ObjectId,
      ref: "Store",
      required: true,
    },
    categoryId: {
      type: ObjectId,
      ref: "CategoryStock",
      required: true,
    },
    itemId: {
      type: ObjectId,
      ref: "StockItem",
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    movementDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    costMethod: {
      type: String,
      enum: ["FIFO", "LIFO", "Weighted Average"],
      required: true,
    },
    source: {
      type: String,
      enum: [
        "OpeningBalance",
        "Purchase",
        "ReturnPurchase",
        "Issuance",
        "ReturnIssuance",
        "Wastage",
        "Damaged",
        "Transfer",
        "ReturnTransfer",
        "stockAdjustment",
      ],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      
    },
    inbound: {
      quantity: {
        type: Number,
        required: false,
        default: 0,
      },
      unitCost: {
        type: Number,
        required: false,
        default: 0,
      },
      totalCost: {
        type: Number,
        required: false,
        default: 0,
      },
    },
    outbound: {
      quantity: {
        type: Number,
        required: false,
        default: 0,
      },
      unitCost: {
        type: Number,
        required: false,
        default: 0,
      },
      totalCost: {
        type: Number,
        required: false,
        default: 0,
      },
    },
    balance: {
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      unitCost: {
        type: Number,
        required: true,
        default: 0,
      },
      totalCost: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    remainingQuantity: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    expirationDate: {
      type: Date,
    },
    sender: {
      type: ObjectId,
      ref: function () {
        return this.source === "Purchase"? "Supplier": "Employee";
      },
      required: true,
    },
    receiver: {
      type: ObjectId,
      ref: function () {
        return  this.source === "ReturnIssuance" ? "Supplier" : "Employee";
      },
      required: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      required: true,
    },
    updatedBy: {
      type: ObjectId,
      ref: "Employee",
    },

  },
  {
    timestamps: true,
  }
);

const StockMovementModel = mongoose.model("StockMovement", StockMovementSchema);
module.exports = StockMovementModel;
