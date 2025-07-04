const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// Define default configuration for numeric fields
const defaultOptions = {
  type: Number,
  default: 0,
  required: true,
  min: 0,
  max: 1000000,
  trim: true,
};

// Define the Order schema
const OrderSchema = new mongoose.Schema(
  {
    // Serial number of the order (6 digits, unique)
    serial: {
      type: String,
      default: "000001",
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{6}$/.test(v); // Must be a 6-digit number
        },
        message: "{VALUE} is not a valid serial number",
      },
    },
    // Order number
    orderNum: {
      type: Number,
      min: 1,
      max: 1000000,
    },
    // Order type (Internal, Delivery, Takeaway)
    orderType: {
      type: String,
      enum: ["Internal", "Delivery", "Takeaway"],
      default: "Internal",
      required: true,
    },

    // List of products associated with the order

    products: [
      {
        // Product ID
        productId: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        // Product name
        name: {
          type: String,
          required: true,
          trim: true,
        },
        // Product size ID
        sizeId: {
          type: ObjectId,
          ref: "Product",
        },
        // Product size
        size: {
          type: String,
          trim: true,
        },
        // Product quantity
        quantity: {
          ...defaultOptions,
          validate: {
            validator: function (v) {
              return v >= 1 && v <= 1000000; // Must be between 1 and 1,000,000
            },
            message: "{VALUE} is not a valid quantity",
          },
        },
        // Additional notes for the product
        notes: {
          type: String,
          default: "",
          trim: true,
        },
        // Product price
        price: {
          ...defaultOptions,
          validate: {
            validator: function (v) {
              return v >= 1 && v <= 1000000; // Must be greater than 0
            },
            message: "{VALUE} is not a valid price",
          },
        },
        // Price after applying discounts
        priceAfterDiscount: {
          ...defaultOptions,
        },
        // Total price for the product (quantity x price)
        totalprice: {
          ...defaultOptions,
        },
        // Number of paid items
        numOfPaid: {
          ...defaultOptions,
        },
        // Indicates if the product is sent to preparation
        isSend: {
          type: Boolean,
          default: false,
          required: true,
        },
        // Indicates if the product preparation is completed
        isDone: {
          type: Boolean,
          default: false,
          required: true,
        },
        // Indicates if the product is delivered
        isDeleverd: {
          type: Boolean,
          default: false,
          required: true,
        },
        // // Indicates if the product is an addition to the order
        // isAdd: {
        //   type: Boolean,
        //   default: false,
        //   required: true,
        // },
        // List of extras for the product
        extras: [
          {
            extraDetails: [
              {
                // Extra item ID
                extraId: {
                  type: ObjectId,
                  ref: "Product",
                },
                // Extra item name
                name: {
                  type: String,
                  required: true,
                  trim: true,
                },
                // Extra item price
                price: {
                  ...defaultOptions,
                  validate: {
                    validator: function (v) {
                      return v >= 1 && v <= 100000; // Must be valid price range
                    },
                    message: "{VALUE} is not a valid price",
                  },
                },
              },
            ],
            // Indicates if the extra item is done
            isDone: {
              type: Boolean,
              default: false,
              required: true,
            },
            // Indicates if the extra item is paid
            isPaid: {
              type: Boolean,
              required: true,
              default: false,
            },
            // Total price for all extras
            totalExtrasPrice: {
              ...defaultOptions,
              validate: {
                validator: function (v) {
                  return v >= 1 && v <= 100000; // Must be within valid range
                },
                message: "{VALUE} is not a valid total price for extras",
              },
            },
          },
        ],
      },
    ],
    // Subtotal of the split order
    subtotalSplitOrder: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0; // Must be non-negative
        },
        message: "{VALUE} should be greater than or equal to zero",
      },
    },
    // Subtotal of the order
    subTotal: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0; // Must be non-negative
        },
        message: "{VALUE} should be greater than or equal to zero",
      },
    },
    // Sales tax applied to the order
    salesTax: {
      type: Number,
      default: 0,
      required: true,
    },
    // Service tax applied to the order
    serviceTax: {
      type: Number,
      default: 0,
      required: true,
    },
    // Delivery cost for the order
    deliveryFee: {
      type: Number,
      default: 0,
      required: true,
    },
    // Discount applied to the order
    discount: {
      type: Number,
      default: 0,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0 && v <= 1000000;
        },
        message: "{VALUE} is not a valid discount value",
      },
    },
    // Additional charges applied to the order
    addition: {
      type: Number,
      default: 0,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0 && v <= 1000000;
        },
        message: "{VALUE} is not a valid addition value",
      },
    },
    // Total cost of the order
    total: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0; // Must be non-negative
        },
        message: "{VALUE} should be greater than or equal to zero",
      },
    },
    // Table associated with the order
    table: {
      type: ObjectId,
      ref: "Table",
      default: null,
    },
    // Employee who created the order
    createdBy: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },
    // Employee cashier for the order
    cashier: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },
    // Delivery person for the order
    deliveryMan: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },
    // Customer (User) associated with the order
    user: {
      type: ObjectId,
      ref: "User",
      default: null,
    },
    // Customer name
    name: {
      type: String,
    },
    // Customer address
    address: {
      type: String,
      default: null,
    },
    // Customer phone number
    phone: {
      type: String,
      default: null,
    },
    // Order status
    status: {
      type: String,
      default: "Pending",
      required: true,
      trim: true,
      enum: [
        "Pending",
        "Approved",
        "Prepared",
        "On the way",
        "Delivered",
        "Cancelled",
      ],
    },
    // Waiter serving the order
    waiter: {
      type: ObjectId,
      ref: "Employee",
      default: null,
    },
    // Help request status
    help: {
      type: String,
      default: "Not requested",
      required: true,
      trim: true,
      enum: ["Not requested", "Requests assistance", "Requests bill"],
    },
    // Help request progress
    helpStatus: {
      type: String,
      default: "Not send",
      required: true,
      trim: true,
      enum: ["Not send", "Send waiter", "On the way", "Assistance done"],
    },
    // Indicates if the order is split
    isSplit: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Indicates if the order is active
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    // Payment status of the order
    payment_status: {
      type: String,
      default: "Pending",
      required: true,
      enum: ["Pending", "Paid"],
      trim: true,
    },
    // Payment date
    payment_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    // Payment method used
    paymentMethod: {
      type: String,
      default: "Cash",
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create the Order model
const OrderModel = mongoose.model("Order", OrderSchema);

// Export the Order model
module.exports = OrderModel;
