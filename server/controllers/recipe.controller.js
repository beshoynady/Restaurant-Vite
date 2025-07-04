const RecipeModel = require("../models/Recipe.model");

// Validate ingredients
const validateIngredients = (ingredients) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error("Ingredients must be a non-empty array");
  }

  ingredients.forEach((ingredient) => {
    if (
      !ingredient.itemId ||
      typeof ingredient.itemId !== "string" ||
      !ingredient.name ||
      typeof ingredient.name !== "string" ||
      !ingredient.amount ||
      typeof ingredient.amount !== "number" ||
      !ingredient.unit ||
      typeof ingredient.unit !== "string" ||
      (ingredient.wastePercentage !== undefined &&
        (typeof ingredient.wastePercentage !== "number" ||
          ingredient.wastePercentage < 0 ||
          ingredient.wastePercentage > 100))
    ) {
      throw new Error("Invalid ingredient fields");
    }
  });
};

// Validate serviceDetails
const validateServiceDetails = (serviceDetails) => {
  if (!Array.isArray(serviceDetails)) {
    throw new Error("Service details must be an array");
  }

  serviceDetails.forEach((service) => {
    if (
      !service.itemId ||
      typeof service.itemId !== "string" ||
      !service.name ||
      typeof service.name !== "string" ||
      !service.amount ||
      typeof service.amount !== "number" ||
      !service.unit ||
      typeof service.unit !== "string" ||
      (service.wastePercentage !== undefined &&
        (typeof service.wastePercentage !== "number" ||
          service.wastePercentage < 0 ||
          service.wastePercentage > 100)) ||
      !Array.isArray(service.serviceType) ||
      !service.serviceType.every((type) =>
        ["dineIn", "takeaway", "delivery"].includes(type)
      )
    ) {
      throw new Error("Invalid service details format");
    }
  });
};

// Create a new recipe
const createRecipe = async (req, res) => {
  try {
    const {
      productId,
      productName,
      sizeName,
      sizeId,
      numberOfMeals,
      preparationTime,
      ingredients,
      serviceDetails,
      preparationSteps,
    } = req.body;

    if (
      !productId ||
      !productName ||
      !numberOfMeals ||
      !preparationTime ||
      !ingredients
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    validateIngredients(ingredients);
    validateServiceDetails(serviceDetails);

    const newRecipe = await RecipeModel.create({
      productId,
      productName,
      sizeName,
      sizeId,
      numberOfMeals,
      preparationTime,
      ingredients,
      serviceDetails,
      preparationSteps,
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Duplicate sizeId value", error });
    } else {
      res.status(500).json({ message: error.message, error });
    }
  }
};

// Update an existing recipe
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numberOfMeals,
      preparationTime,
      ingredients,
      serviceDetails,
      preparationSteps,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Recipe ID is required" });
    }

    const updateFields = {};

    if (numberOfMeals) updateFields.numberOfMeals = numberOfMeals;
    if (preparationTime) updateFields.preparationTime = preparationTime;
    if (preparationSteps) updateFields.preparationSteps = preparationSteps;

    if (Array.isArray(ingredients)) {
      validateIngredients(ingredients);
      updateFields.ingredients = ingredients;
    }

    if (Array.isArray(serviceDetails)) {
      validateServiceDetails(serviceDetails);
      updateFields.serviceDetails = serviceDetails;
    }

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Get a single recipe by ID
const getOneRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id)
      .populate("productId", "_id name")
      .populate("ingredients.itemId", "_id itemName costPerPart minThreshold")
      .populate(
        "serviceDetails.itemId",
        "_id itemName costPerPart minThreshold"
      );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Get all recipes
const getAllRecipe = async (req, res) => {
  try {
    const recipes = await RecipeModel.find()
      .populate("productId", "_id name")
      .populate("ingredients.itemId", "_id itemName costPerPart minThreshold")
      .populate(
        "serviceDetails.itemId",
        "_id itemName costPerPart minThreshold"
      );

    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Delete a recipe by ID
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await RecipeModel.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

module.exports = {
  createRecipe,
  updateRecipe,
  getOneRecipe,
  getAllRecipe,
  deleteRecipe,
};
