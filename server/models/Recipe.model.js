const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const RecipeSchema = new mongoose.Schema(
  {
    productId: {
      type: ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    sizeId: {
      type: ObjectId,
      ref: "Product",
      default: null,
    },
    sizeName: {
      type: String,
      required: [true, "Size name is required"],
      minlength: 2,
      maxlength: 100,
      default: "oneSize",
    },
    numberOfMeals: {
      type: Number,
      required: [true, "Number of meals is required"],
      default: 1,
      min: [1, "Number of meals must be at least 1"],
    },
    preparationTime: {
      type: Number,
      required: [true, "Preparation time is required"],
      default: 0,
      min: [0, "Preparation time cannot be negative"],
    },
    ingredients: [
      {
        itemId: {
          type: ObjectId,
          ref: "StockItem",
          required: [true, "Ingredient item ID is required"],
        },
        name: {
          type: String,
          trim: true,
          required: [true, "Ingredient name is required"],
          minlength: [2, "Ingredient name must be at least 2 characters"],
          maxlength: [100, "Ingredient name cannot exceed 100 characters"],
        },
        amount: {
          type: Number,
          required: [true, "Ingredient amount is required"],
          min: [0.01, "Ingredient amount must be greater than 0"],
        },
        unit: {
          type: String,
          trim: true,
          required: [true, "Unit is required"],
          minlength: [1, "Unit must have at least 1 character"],
          maxlength: [20, "Unit cannot exceed 20 characters"],
        },
        wastePercentage: {
          type: Number,
          default: 0,
          min: [0, "Waste percentage cannot be negative"],
          max: [100, "Waste percentage cannot exceed 100"],
        },
      },
    ],

    serviceDetails: [
      {
        itemId: { type: ObjectId, ref: "StockItem", required: true },
        name: { type: String, trim: true, required: true },
        amount: { type: Number, required: true, min: 0 },
        unit: { type: String, trim: true, required: true },
        wastePercentage: { type: Number, default: 0, min: 0, max: 100 },
        serviceType: [
          {
            type: String,
            required: true,
            enum: ["dineIn", "takeaway", "delivery"],
          },
        ],
      },
    ],
    preparationSteps: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],
  },
  {
    timestamps: true,
  }
);

RecipeSchema.index(
  { sizeId: 1 },
  {
    unique: true,
    partialFilterExpression: { sizeId: { $exists: true, $ne: null } },
  }
);

const RecipeModel = mongoose.model("Recipe", RecipeSchema);

module.exports = RecipeModel;
