const PreparationSectionModel = require("../models/PreparationSection.model");

// Create a new preparation section
const createPreparationSection = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    // Check if required fields are provided
    if (!name || typeof isActive === "undefined") {
      return res.status(400).json({
        success: false,
        message: 'Both "name" and "isActive" fields are required.',
      });
    }

    const createdBy = req.employee?.id;

    // Check if the employee is authorized
    if (!createdBy) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Employee ID is required.",
      });
    }

    // Check if the section already exists
    const existingSection = await PreparationSectionModel.findOne({ name });
    if (existingSection) {
      return res.status(409).json({
        success: false,
        message: "This section already exists.",
      });
    }

    // Create new preparation section
    const newSection = await PreparationSectionModel.create({
      name,
      isActive,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "New preparation section created successfully.",
      data: newSection,
    });
  } catch (error) {
    console.error("Error creating preparation section:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the preparation section.",
      error: error,
    });
  }
};

// Get all preparation sections
const getAllPreparationSections = async (req, res) => {
  try {
    const sections = await PreparationSectionModel.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "_id fullname username role")
      .populate("updatedBy", "_id fullname username role");
    return res.status(200).json({
      success: true,
      message: "Preparation sections retrieved successfully.",
      data: sections,
    });
  } catch (error) {
    console.error("Error retrieving preparation sections:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving preparation sections.",
      error: error,
    });
  }
};

// Get a preparation section by ID
const getPreparationSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await PreparationSectionModel.findById(id)
      .populate("createdBy", "_id fullname username role")
      .populate("updatedBy", "_id fullname username role");
    if (!section) {
      return res.status(404).json({
        success: false,
        message: `No preparation section found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Preparation section retrieved successfully.",
      data: section,
    });
  } catch (error) {
    console.error("Error retrieving preparation section by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the preparation section.",
      error: error,
    });
  }
};

// Update a preparation section
const updatePreparationSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const updatedBy = req.employee?.id;

    if (!updatedBy) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Employee ID is required.",
      });
    }

    const section = await PreparationSectionModel.findById(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: `No preparation section found with ID: ${id}`,
      });
    }

    if (name) section.name = name;
    if (typeof isActive !== "undefined") section.isActive = isActive;
    section.updatedBy = updatedBy;

    const updatedSection = await section.save();

    return res.status(200).json({
      success: true,
      message: "Preparation section updated successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error updating preparation section:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the preparation section.",
      error: error,
    });
  }
};

// Delete a preparation section
const deletePreparationSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await PreparationSectionModel.findById(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: `No preparation section found with ID: ${id}`,
      });
    }

    await section.remove();

    return res.status(200).json({
      success: true,
      message: "Preparation section deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting preparation section:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the preparation section.",
      error: error,
    });
  }
};

module.exports = {
  createPreparationSection,
  getAllPreparationSections,
  getPreparationSectionById,
  updatePreparationSection,
  deletePreparationSection,
};
