const RestaurantModel = require("../models/Restaurant.model");
const mongoose = require("mongoose");

// Create a new restaurant
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      aboutText,
      address,
      locationUrl,
      dineIn,
      takeAway,
      deliveryService,
      contact,
      social_media,
      opening_hours,
      website,
      acceptedPayments,
      features,
      usesReservationSystem,
      subscriptionStart,
      subscriptionEnd,
      salesTaxRate,
      serviceTaxRate,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!name || !description || !address || !website) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const restaurant = await RestaurantModel.create({
      name,
      description,
      image,
      aboutText,
      address,
      locationUrl,
      dineIn,
      takeAway,
      deliveryService,
      contact,
      social_media,
      opening_hours,
      website,
      acceptedPayments,
      features,
      usesReservationSystem,
      subscriptionStart,
      subscriptionEnd,
      salesTaxRate,
      serviceTaxRate,
    });

    return res.status(201).json(restaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

// Get a single restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await RestaurantModel.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await RestaurantModel.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found async" });
    }

    return { restaurant };
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

// Update a restaurant by ID
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      aboutText,
      address,
      locationUrl,
      dineIn,
      takeAway,
      deliveryService,
      contact,
      social_media,
      opening_hours,
      website,
      acceptedPayments,
      features,
      usesReservationSystem,
      subscriptionStart,
      subscriptionEnd,
      salesTaxRate,
      serviceTaxRate,
    } = req.body;

    // التحقق من صحة معرّف المطعم
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    // البحث عن المطعم الموجود
    const existingRestaurant = await RestaurantModel.findById(id);
    if (!existingRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const image = req.file ? req.file.filename : existingRestaurant.image;

    // تحديث المطعم
    const restaurant = await RestaurantModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        image,
        aboutText,
        address,
        locationUrl,
        dineIn,
        takeAway,
        deliveryService,
        contact,
        social_media,
        opening_hours,
        website,
        acceptedPayments,
        features,
        usesReservationSystem,
        subscriptionStart,
        subscriptionEnd,
        salesTaxRate,
        serviceTaxRate,
      },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // استجابة بنجاح
    return res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a restaurant by ID
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await RestaurantModel.findByIdAndDelete(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

// Update subscription dates for a restaurant by ID
const updateSubscriptionDates = async (req, res) => {
  try {
    const employee = req.employee;
    if (employee.role !== "programer") {
      return res
        .status(403)
        .json({
          message:
            "Access denied. Only programmers can update subscription dates.",
        });
    }

    const { id } = req.params;
    const { subscriptionStart, subscriptionEnd } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await RestaurantModel.findByIdAndUpdate(
      id,
      {
        subscriptionStart,
        subscriptionEnd,
      },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json({ restaurant });
  } catch (error) {
    console.error("Error updating subscription dates:", error.message);
    return res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateSubscriptionDates,
};
