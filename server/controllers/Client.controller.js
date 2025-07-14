const ClientModel = require('../models/Client.model');

const createClient = async (req, res) => {
  const { name, phone, deliveryArea, address, notes } = req.body;

  try {
    const existingClient = await ClientModel.findOne({ phone });
    if (existingClient) {
      return res.status(409).json({ message: 'Client with this phone number already exists' });
    }

    const newClient = await ClientModel.create({
      name, phone, deliveryArea, address,notes,
    });

    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await ClientModel.find({}).populate('deliveryArea');
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getClientByMobile = async (req, res) => {
  const { phone } = req.params;

  try {
    const client = await ClientModel.findOne({ phone }).populate('deliveryArea');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await ClientModel.findById(id).populate('deliveryArea');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateClientById = async (req, res) => {
  const { id } = req.params;
  const { name, phone, deliveryArea, address, isVarified, notes, refusesOrders } = req.body;

  try {
    const client = await ClientModel.findByIdAndUpdate(
      id,
      { name, phone, deliveryArea, address, isVarified, notes, refusesOrders },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await ClientModel.findByIdAndDelete(id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientByMobile,
  getClientById,
  updateClientById,
  deleteClientById,
};
