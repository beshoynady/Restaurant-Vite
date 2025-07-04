const PreparationTicketModel = require("../models/PreparationTicket.model.js");

const createPreparationTicket = async (req, res) => {
  try {
    const {
      order,
      preparationSection,
      preparationStatus,
      products,
      isActive,
      timeReceived,
      expectedCompletionTime,
      notes,
    } = req.body;

    const newPreparationTicket = await PreparationTicketModel.create({
      order,
      preparationSection,
      preparationStatus,
      products,
      isActive,
      timeReceived,
      expectedCompletionTime,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Preparation ticket created successfully",
      data: newPreparationTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create preparation ticket",
      error: error.message,
    });
  }
};

const getAllPreparationTickets = async (req, res) => {
  try {
    const preparationTickets = await PreparationTicketModel.find()
      .populate("order")
      .populate({
        path: "order",
        populate: {
          path: "table",
        },
      })
      .populate("products.productId", "_id name preparationSection")
      .populate("products.extras.extraDetails.extraId", "_id name")
      .populate("preparationSection", "_id name")
      .populate("responsibleEmployee", "_id username role")
      .populate("waiter", "_id fullname username role shift sectionNumber");

    res.status(200).json({
      success: true,
      data: preparationTickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch preparation tickets",
      error: error.message,
    });
  }
};

const getActivePreparationTickets = async (req, res) => {
  try {
    const preparationTickets = await PreparationTicketModel.find({ isActive: true })
      .populate("order")
      .populate({
        path: "order",
        populate: {
          path: "table",
        },
      })
      .populate("products.productId", "_id name preparationSection")
      .populate("products.extras.extraDetails.extraId", "_id name")
      .populate("preparationSection", "_id name")
      .populate("responsibleEmployee", "_id username role")
      .populate("waiter", "_id fullname username role shift sectionNumber");

    res.status(200).json({
      success: true,
      data: preparationTickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch preparation tickets",
      error: error.message,
    });
  }
};

const getPreparationTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const preparationTicket = await PreparationTicketModel.findById(id)
      .populate("order")
      .populate({
        path: "order",
        populate: {
          path: "table",
        },
      })
      .populate("products.productId", "_id name preparationSection")
      .populate("products.extras.extraDetails.extraId", "_id name")
      .populate("preparationSection", "_id name")
      .populate("responsibleEmployee", "_id username role")
      .populate("waiter", "_id fullname username role shift sectionNumber");

    if (!preparationTicket) {
      return res.status(404).json({
        success: false,
        message: "Preparation ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      data: preparationTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch preparation ticket",
      error: error.message,
    });
  }
};

const updatePreparationTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      preparationStatus,
      responsibleEmployee,
      waiter,
      products,
      isActive,
      actualCompletionTime,
      notes,
    } = req.body;

    const updatedPreparationTicket = await PreparationTicketModel.findByIdAndUpdate(
      id,
      {
        $set: {
          preparationStatus,
          responsibleEmployee,
          waiter,
          products,
          isActive,
          actualCompletionTime,
          notes,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedPreparationTicket) {
      return res.status(404).json({
        success: false,
        message: "Preparation ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Preparation ticket updated successfully",
      data: updatedPreparationTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update preparation ticket",
      error: error.message,
    });
  }
};

const deletePreparationTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPreparationTicket = await PreparationTicketModel.findByIdAndDelete(id);

    if (!deletedPreparationTicket) {
      return res.status(404).json({
        success: false,
        message: "Preparation ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Preparation ticket deleted successfully",
      data: deletedPreparationTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete preparation ticket",
      error: error.message,
    });
  }
};

module.exports = {
  createPreparationTicket,
  getAllPreparationTickets,
  getActivePreparationTickets,
  getPreparationTicketById,
  updatePreparationTicket,
  deletePreparationTicket,
};
