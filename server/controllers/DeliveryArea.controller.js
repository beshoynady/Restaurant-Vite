const DeliveryAreaModel = require('../models/DeliveryArea.model');

// Create a new delivery area
const createDeliveryArea = async (req, res) => {
  try {
    const { name, delivery_fee } = req.body;
    const newDeliveryArea = await DeliveryAreaModel.create({ name, delivery_fee });
    res.status(201).json(newDeliveryArea);
  } catch (error) {
    console.error('Error creating delivery area:', error);
    res.status(400).json({ message: 'Failed to create delivery area', error: error.message });
  }
};

// Get all delivery areas
const getAllDeliveryAreas = async (req, res) => {
  try {
    const deliveryAreas = await DeliveryAreaModel.find();
    res.status(200).json(deliveryAreas);
  } catch (error) {
    console.error('Error getting all delivery areas:', error);
    res.status(500).json({ message: 'Failed to get delivery areas', error: error.message });
  }
};

// Get a specific delivery area by ID
const getDeliveryAreaById = async (req, res) => {
  try {
    const deliveryAreaId = req.params.id;
    const deliveryArea = await DeliveryAreaModel.findById(deliveryAreaId);
    if (!deliveryArea) {
      return res.status(404).json({ message: 'Delivery area not found' });
    }
    res.status(200).json(deliveryArea);
  } catch (error) {
    console.error('Error getting delivery area by ID:', error);
    res.status(500).json({ message: 'Failed to get delivery area', error: error.message });
  }
};

// Update a specific delivery area by ID
const updateDeliveryArea = async (req, res) => {
  try {
    const deliveryAreaId = req.params.id;
    const { name, delivery_fee } = req.body;
    const updatedDeliveryArea = await DeliveryAreaModel.findByIdAndUpdate(deliveryAreaId, { name, delivery_fee }, { new: true });
    if (!updatedDeliveryArea) {
      return res.status(404).json({ message: 'Delivery area not found' });
    }
    res.status(200).json(updatedDeliveryArea);
  } catch (error) {
    console.error('Error updating delivery area:', error);
    res.status(400).json({ message: 'Failed to update delivery area', error: error.message });
  }
};

// Delete a specific delivery area by ID
const deleteDeliveryArea = async (req, res) => {
  try {
    const deliveryAreaId = req.params.id;
    const deletedDeliveryArea = await DeliveryAreaModel.findByIdAndDelete(deliveryAreaId);
    if (!deletedDeliveryArea) {
      return res.status(404).json({ message: 'Delivery area not found' });
    }
    res.status(200).json({ message: 'Delivery area deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery area:', error);
    res.status(400).json({ message: 'Failed to delete delivery area', error: error.message });
  }
};

module.exports = {
  createDeliveryArea,
  getAllDeliveryAreas,
  getDeliveryAreaById,
  updateDeliveryArea,
  deleteDeliveryArea
};
