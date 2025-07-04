const mongoose = require("mongoose");

const purchaseInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    returnInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseReturnInvoice",
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StockItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        storageUnit: { type: String, required: true },
        price: { type: Number, required: true },
        cost: { type: Number, required: true },
        expirationDate: { type: Date },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    discount: { type: Number, default: 0 },
    salesTax: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    returnAmount: { type: Number, default: 0 },
    balanceDue: { type: Number, required: true, default: 0 },
    paymentDueDate: { type: Date, default: null },
    additionalCost: { type: Number, default: 0 },
    
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid"],
      default: "unpaid",
    },
    paymentType: {
      type: String,
      enum: ["cash", "credit"],
      default: "cash",
    },
    paymentMethod: {
      type: String,
      default: "",
    },
    cashRegister: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CashRegister",
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseInvoiceModel = mongoose.model(
  "PurchaseInvoice",
  purchaseInvoiceSchema
);
module.exports = PurchaseInvoiceModel;
