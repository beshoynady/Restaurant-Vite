const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const PreparationTicketSchema = new mongoose.Schema(
  {
    order: {
      type: ObjectId,
      ref: "Order",
      required: true,
    },
    preparationSection: {
      type: ObjectId,
      ref: "PreparationSection",
      required: true,
    },
    preparationStatus: {
      type: String,
      default: "Pending",
      required: true,
      enum: [
        "Pending",
        "Preparing",
        "Prepared",
        "On the way",
        "Delivered",
        "Cancelled",
        "Rejected",
      ],
    },
    responsibleEmployee: {
      type: ObjectId,
      ref: "Employee",
    },
    waiter: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },
    products: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        orderproductId: {
          type: ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        sizeId: {
          type: ObjectId,
          ref: "Product",
        },
        size: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 0,
          required: true,
          min: 1,
          max: 1000000,
        },
        notes: {
          type: String,
          default: "",
          trim: true,
        },
        extras: [
          {
            extraDetails: [
              {
                extraId: {
                  type: ObjectId,
                  ref: "Product",
                },
                name: {
                  type: String,
                  required: true,
                  trim: true,
                },
              },
            ],
          },
        ],
      },
    ],
    timeReceived: {
      type: Date,
      required: true,
    },
    expectedCompletionTime: {
      type: Date,
      required: true,
    },
    actualCompletionTime: {
      type: Date,
    },
    isDone: {
      type: Boolean,
      default: false,
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const PreparationTicketModel = mongoose.model(
  "PreparationTicket",
  PreparationTicketSchema
);

module.exports = PreparationTicketModel;