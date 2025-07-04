const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const StoreSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    storeCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[A-Z0-9]{1,10}$/.test(value);
        },
        message: "storeCode must be 1-10 uppercase letters or digits only.",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    storekeeper: [
      {
        type: ObjectId,
        ref: "Employee",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "closed"],
      default: "active",
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

const StoreModel = mongoose.model("Store", StoreSchema);
module.exports = StoreModel;
