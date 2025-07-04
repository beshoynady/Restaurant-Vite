const path = require("path");
const ProductionOrderModel = require("../models/ProductionOrder.model");

const createProductionOrder = async (req, res) => {
  try {
    const {
      storeId,
      preparationSection,
      stockItem,
      unit,
      quantityRequested,
      notes,
    } = req.body;
    const createdBy = await req.employee.id;

    if (
      !storeId ||
      !preparationSection ||
      !stockItem ||
      !unit ||
      !quantityRequested ||
      !createdBy
    ) {
      return res.status(400).send({
        error: "All fields are required to create a production order",
      });
    }

    const lastOrder = await ProductionOrderModel.findOne(
      {},
      { orderNumber: 1 }
    ).sort({ orderNumber: -1 });

    const neworderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

    const productionOrder = await ProductionOrderModel.create({
      orderNumber: neworderNumber,
      storeId,
      preparationSection,
      stockItem,
      unit,
      quantityRequested,
      notes,
      createdBy,
    });

    res.status(201).json(productionOrder);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getProductionOrdersByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const productionOrders = await ProductionOrderModel.find({ storeId });
    if (productionOrders.length === 0) {
      return res.status(404).send({ error: "No production orders found" });
    }
    res.status(200).json(productionOrders);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getProductionOrdersByPreparationSection = async (req, res) => {
  try {
    const { preparationSection } = req.params;
    const productionOrders = await ProductionOrderModel.find({
      preparationSection,
    });
    if (productionOrders.length === 0) {
      return res.status(404).send({ error: "No production orders found" });
    }
    res.status(200).json(productionOrders);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getProductionOrders = async (req, res) => {
  try {
    const productionOrders = await ProductionOrderModel.find()
      .populate("preparationSection", "_id name")
      .populate("storeId", "_id storeName")
      .populate({
        path: "stockItem",
        select: "_id itemName SKU categoryId",
        populate: {
          path: "categoryId",
          select: "_id categoryName",
        },
      })
      .populate("createdBy", "_id fullname username role")
      .populate({
        path: "updatedBy",
        select: "_id fullname username role",
        match: { _id: { $ne: null } }, // Ensure updatedBy is populated only if it exists
      });
    if (productionOrders.length === 0) {
      return res.status(404).send({ error: "No production orders found" });
    }
    res.status(200).json(productionOrders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

const getProductionOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const productionOrder = await ProductionOrderModel.findById(id)
      .populate("storeId", "_id storeName")
      .populate("preparationSection", "_id name")
      .populate({
        path: "stockItem",
        select: "_id itemName SKU categoryId",
        populate: {
          path: "categoryId",
          select: "_id categoryName",
        },
      })
      .populate("createdBy", "_id fullname username role")
      .populate({
        path: "updatedBy",
        select: "_id fullname username role",
        match: { _id: { $ne: null } }, // Ensure updatedBy is populated only if it exists
      });
    if (!productionOrder) {
      return res.status(404).send({ error: "Production order not found" });
    }
    res.status(200).json(productionOrder);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

const updateProductionOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      storeId,
      preparationSection,
      stockItem,
      unit,
      quantityRequested,
      notes,
    } = req.body;
    const updatedBy = req.employee.id;
    if (
      !storeId ||
      !preparationSection ||
      !stockItem ||
      !unit ||
      !quantityRequested ||
      !updatedBy
    ) {
      return res.status(400).send({
        error: "All fields are required to update a production order",
      });
    }
    const findProductionOrder = await ProductionOrderModel.findById(id);
    if (!findProductionOrder) {
      return res.status(404).send({ error: "Production order not found" });
    }
    if (findProductionOrder.productionStatus !== "Pending") {
      return res
        .status(400)
        .send({ error: "Production order cannot be updated" });
    }

    const productionOrder = await ProductionOrderModel.findByIdAndUpdate(
      id,
      {
        $set: {
          storeId,
          preparationSection,
          stockItem,
          unit,
          quantityRequested,
          notes,
          updatedBy,
        },
      },
      { new: true }
    );
    if (!productionOrder) {
      return res.status(404).send({ error: "Production order not found" });
    }

    res.status(200).json(productionOrder);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateProductionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { productionStatus } = req.body;
    const updatedBy = req.employee.id;
    if (!productionStatus || !updatedBy) {
      return res
        .status(400)
        .send({ error: "Production status and updated by are required" });
    }
    const allowedUpdates = [
      "Pending",
      "In Progress",
      "Completed",
      "Canceled",
      "Rejected",
    ];
    if (!allowedUpdates.includes(productionStatus)) {
      return res.status(400).send({ error: "Invalid production status" });
    }

    const productionOrder = await ProductionOrderModel.findOneAndUpdate(
      {
        _id: id,
        productionStatus: { $nin: ["Completed", "Canceled", "Rejected"] },
      },
      { $set: { productionStatus, updatedBy } },
      { new: true }
    );
    if (!productionOrder) {
      return res
        .status(404)
        .send({ error: "Production order not found or cannot be updated" });
    }

    res.status(200).json(productionOrder);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteProductionOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const productionOrder = await ProductionOrderModel.findOneAndDelete({
      _id: id,
      productionStatus: "Pending",
    });

    if (!productionOrder) {
      return res
        .status(404)
        .send({ error: "Production order not found or cannot be deleted" });
    }

    res.status(200).json({ message: "Production order deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  createProductionOrder,
  getProductionOrdersByStore,
  getProductionOrdersByPreparationSection,
  getProductionOrders,
  getProductionOrder,
  updateProductionOrder,
  updateProductionStatus,
  deleteProductionOrder,
};
