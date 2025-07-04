const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productionRecipeSchema = new mongoose.Schema(
  {
    stockItem: {
      type: ObjectId,
      ref: "StockItem",
      required: true,
    },
    stockItemName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    batchSize: {
      type: Number,
      required: true,
      default: 1,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    preparationTime: {
      type: Number,
      required: true,
      default: 0,
    },
    ingredients: [
      {
        itemId: {
          type: ObjectId,
          ref: "StockItem",
          required: true,
        },
        name: {
          type: String,
          trim: true,
          required: true,
          maxLength: 50,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
          max: 1000,
        },
        unit: {
          type: String,
          trim: true,
          required: true,
          maxLength: 50,
        },
        wastePercentage: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    ],

    preparationSteps: [
      {
        description: { type: String, trim: true, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const RecipeModel = mongoose.model(
  "ProductionRecipe",
  productionRecipeSchema
);

module.exports = RecipeModel;
