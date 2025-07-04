const CustomerMessageModel = require('../models/Message.model');

// Create a new customer message
const createCustomerMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !phone || !message) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        const newMessage = await CustomerMessageModel.create({ name, email, phone, message });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error creating customer message:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all customer messages
const getAllCustomerMessages = async (req, res) => {
    try {
        const messages = await CustomerMessageModel.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error getting all customer messages:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single customer message by ID
const getCustomerMessageById = async (req, res) => {
    try {
        const messageId = req.params.id;
        const message = await CustomerMessageModel.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        console.error("Error getting customer message by ID:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a customer message by ID
const updateCustomerMessageById = async (req, res) => {
    try {
        const messageId = req.params.id;
        const isSeen = req.body.isSeen
        const updatedMessage = await CustomerMessageModel.findByIdAndUpdate(messageId, {isSeen}, { new: true });
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error updating customer message by ID:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a customer message by ID
const deleteCustomerMessageById = async (req, res) => {
    try {
        const messageId = req.params.id;
        const deletedMessage = await CustomerMessageModel.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(deletedMessage);
    } catch (error) {
        console.error("Error deleting customer message by ID:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createCustomerMessage,
    getAllCustomerMessages,
    getCustomerMessageById,
    updateCustomerMessageById,
    deleteCustomerMessageById
};
