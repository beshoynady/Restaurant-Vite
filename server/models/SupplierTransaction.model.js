const mongoose = require("mongoose");

const supplierTransactionSchema = new mongoose.Schema(
  {
    transactionDate: {
      type: Date,
      required: true,
    },
    invoiceNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseInvoice",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    transactionType: {
      type: String,
      enum: [
        "OpeningBalance",
        "Purchase",
        "Payment",
        "PurchaseReturn",
        "Refund",
        "AdvancePayment",
      ],
      required: true,
    },
    previousBalance: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currentBalance: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const SupplierTransactionModel = mongoose.model(
  "SupplierTransaction",
  supplierTransactionSchema
);

module.exports = SupplierTransactionModel;
