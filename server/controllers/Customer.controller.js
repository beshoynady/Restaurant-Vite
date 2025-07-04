const CustomerModel = require('../models/Customer.model');

const createCustomer = async (req, res) => {
  const { name, phone, deliveryArea, address, notes } = req.body;

  try {
    const existingCustomer = await CustomerModel.findOne({ phone });
    if (existingCustomer) {
      return res.status(409).json({ message: 'Customer with this phone number already exists' });
    }

    const newCustomer = await CustomerModel.create({
      name, phone, deliveryArea, address,notes,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.find({}).populate('deliveryArea');
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCustomerByMobile = async (req, res) => {
  const { phone } = req.params;

  try {
    const customer = await CustomerModel.findOne({ phone }).populate('deliveryArea');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await CustomerModel.findById(id).populate('deliveryArea');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateCustomerById = async (req, res) => {
  const { id } = req.params;
  const { name, phone, deliveryArea, address, isVarified, notes, refusesOrders } = req.body;

  try {
    const customer = await CustomerModel.findByIdAndUpdate(
      id,
      { name, phone, deliveryArea, address, isVarified, notes, refusesOrders },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await CustomerModel.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerByMobile,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
