const ClientMessageModel = require('../models/ClientMessage.model');

// Create a new client message
const createClientMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !phone || !message) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        const newMessage = await ClientMessageModel.create({ name, email, phone, message });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error creating client message:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all client messages
const getAllClientMessages = async (req, res) => {
    try {
        const messages = await ClientMessageModel.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error getting all client messages:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single client message by ID
const getClientMessageById = async (req, res) => {
    try {
        const messageId = req.params.id;
        const message = await ClientMessageModel.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        console.error("Error getting client message by ID:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a client message by ID
const updateClientMessageById = async (req, res) => {
    try {
        const messageId = req.params.id;
        const isSeen = req.body.isSeen
        const updatedMessage = await ClientMessageModel.findByIdAndUpdate(messageId, {isSeen}, { new: true });
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error updating client message by ID:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a client message by ID
const deleteClientMessageById = async (req, res) => {
    try {
        const messageId = req.params.id;
        const deletedMessage = await ClientMessageModel.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(deletedMessage);
    } catch (error) {
        console.error("Error deleting client message by ID:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createClientMessage,
    getAllClientMessages,
    getClientMessageById,
    updateClientMessageById,
    deleteClientMessageById
};
