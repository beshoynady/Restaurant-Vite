const ProductionRecipe = require("../models/ProductionRecipe.model");

// Create a new ProductionRecipe
const createProductionRecipe = async (req, res) => {
  try {
    const {
      stockItem,
      stockItemName,
      batchSize,
      preparationTime,
      ingredients,
      preparationSteps
    } = req.body;

    // Validate required fields
    if (!stockItem || !stockItemName || !batchSize || !ingredients) {
      return res.status(400).json({
        error: "All required fields must be provided.",
      });
    }

    // Check if ingredients is a non-empty array
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res
        .status(400)
        .json({ message: "Ingredients must be a non-empty array" });
    }

    // Validate each ingredient
    for (const item of ingredients) {
      if (
        !item.itemId ||
        !item.name ||
        !item.quantity ||
        !item.unit ||
        !item.wastePercentage
      ) {
        return res.status(400).json({ message: "Invalid ingredient fields" });
      }
    }



    // Create and save the new ProductionRecipe
    const newProductionRecipe = await ProductionRecipe.create({
      stockItem,
      stockItemName,
      batchSize,
      preparationTime,
      ingredients,
      preparationSteps
    });

    await newProductionRecipe.save();
    res.status(201).json({
      message: "Stock production ProductionRecipe created successfully.",
      ProductionRecipe: newProductionRecipe,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while creating the ProductionRecipe.",
      details: error.message,
    });
  }
};

// Update an existing ProductionRecipe
const updateProductionRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      stockItem,
      stockItemName,
      batchSize,
      preparationTime,
      ingredients,
      preparationSteps
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ProductionRecipe ID is required" });
    }

    // Initialize the update object
    const updateFields = {};

    // Conditionally add fields to update object
    if (batchSize) {
      updateFields.batchSize = batchSize;
    }

    if (preparationTime) {
      updateFields.preparationTime = preparationTime;
    }

    if (Array.isArray(ingredients)) {
      // Validate ingredients
      for (const item of ingredients) {
        if (
          item.itemId ||
          item.name ||
          item.quantity ||
          item.unit ||
          item.wastePercentage
        ) {
          updateFields.ingredients = ingredients;
        }
      }
    }

    updateFields.serviceDetails = serviceDetails;

    // Update the ProductionRecipe by ID
    const updatedProductionRecipe =
      await ProductionRecipe.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

    if (!updatedProductionRecipe) {
      return res
        .status(404)
        .json({ error: "ProductionRecipe not found for updating." });
    }

    res.status(200).json({
      message: "ProductionRecipe updated successfully.",
      ProductionRecipe: updatedProductionRecipe,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating the ProductionRecipe.",
      details: error.message,
    });
  }
};

// Get a single ProductionRecipe by ID
const getOneProductionRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const ProductionRecipe = await ProductionRecipe.findById(id)
      .populate("stockItem", "_id itemName")
      .populate("ingredients.itemId", "_id itemName costPerPart minThreshold")
      .populate(
        "serviceDetails.items.itemId",
        "_id itemName costPerPart minThreshold"
      );

    if (!ProductionRecipe) {
      return res
        .status(404)
        .json({ message: "ProductionRecipe not found" });
    }

    res.status(200).json(ProductionRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};


const getProductionRecipeByStockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const findProductionRecipe = await ProductionRecipe.findOne({
      stockItem: id,
    })
      .populate("stockItem", "_id itemName")
      .populate("ingredients.itemId", "_id itemName costPerPart minThreshold")
      .populate(
        "serviceDetails.items.itemId",
        "_id itemName costPerPart minThreshold"
      );

    if (!findProductionRecipe) {
      return res
        .status(404)
        .json({ message: "ProductionRecipe not found" });
    }

    res.status(200).json(findProductionRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Get all recipes
const getAllProductionRecipe = async (req, res) => {
  try {
    const recipes = await ProductionRecipe.find()
      .populate("stockItem", "_id itemName")
      .populate("ingredients.itemId", "_id itemName costPerPart minThreshold")
      .populate(
        "serviceDetails.items.itemId",
        "_id itemName costPerPart minThreshold"
      );

    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Delete a ProductionRecipe by ID
const deleteProductionRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await ProductionRecipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ message: "ProductionRecipe not found" });
    }

    res
      .status(200)
      .json({ message: "ProductionRecipe deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

module.exports = {
  createProductionRecipe,
  updateProductionRecipe,
  getOneProductionRecipe,
  getProductionRecipeByStockItem,
  getAllProductionRecipe,
  deleteProductionRecipe,
};
