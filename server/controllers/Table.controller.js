const QRCode = require("qrcode");
const TableModel = require("../models/Table.model");

// Create a new table
const createTable = async (req, res) => {
  const {
    tableNumber,
    tableCode,
    chairs,
    sectionNumber,
    isValid,
    status,
    location,
    notes,
  } = req.body;

  const createdBy = req.employee.id;

  try {
    const existingTable = await TableModel.findOne({
      tableNumber,
      sectionNumber,
    }).exec();

    if (existingTable) {
      return res.status(400).json({
        message: `Table number ${tableNumber} already exists in section ${sectionNumber}`,
      });
    }

    const tableCreated = await TableModel.create({
      tableNumber,
      tableCode,
      chairs,
      sectionNumber,
      isValid,
      status,
      location,
      notes,
      createdBy,
    });

    return res.status(201).json({
      message: "Table created successfully",
      data: tableCreated,
    });
  } catch (err) {
    console.error("Error creating table:", err.message);
    return res.status(400).json({
      message: "Error creating table",
      error: err.message,
    });
  }
};

// Generate a QR code for a table
const createQR = async (req, res) => {
  const { URL } = req.body;

  try {
    const QR = await QRCode.toDataURL(URL);
    return res.status(200).json({ QRCode: QR });
  } catch (err) {
    console.error("Error generating QR code:", err.message);
    return res.status(400).json({
      message: "Error generating QR code",
      error: err.message,
    });
  }
};

// Retrieve all tables
const showAllTables = async (_req, res) => {
  try {
    const allTables = await TableModel.find()
      .populate("createdBy", "fullname username role") // Include creator details
      .populate("updatedBy", "fullname username role"); // Include updater details

    // Check if there are no tables in the database
    if (!allTables || allTables.length === 0) {
      return res.status(200).json({
        message:
          "No tables found. Please add tables to start using the system.",
        tables: [],
      });
    }

    return res.status(200).json({ allTables });
  } catch (error) {
    console.error("Error fetching all tables:", error);

    return res.status(500).json({
      message:
        "An unexpected error occurred while fetching tables. Please try again later.",
      error: error.message,
    });
  }
};

// Retrieve a specific table by ID
const showOneTable = async (req, res) => {
  const id = req.params.tableId;

  try {
    const oneTable = await TableModel.findById(id)
      .populate("createdBy", "fullname username role")
      .populate("updatedBy", "fullname username role");

    if (!oneTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    return res.status(200).json(oneTable);
  } catch (err) {
    console.error("Error fetching table:", err.message);
    return res.status(500).json({
      message: "Error fetching table",
      error: err.message,
    });
  }
};

// Update a table by ID
const updateTable = async (req, res) => {
  const tableId = req.params.tableId; // The ID of the table to be updated
  const updatedBy = req.employee.id; // The ID of the employee performing the update

  const {
    tableNumber,
    tableCode,
    chairs,
    sectionNumber,
    isValid,
    status,
    location,
    notes,
  } = req.body;

  try {
    // Check if the table to be updated exists
    const currentTable = await TableModel.findById(tableId).exec();

    if (!currentTable) {
      return res.status(404).json({ message: "Table not found." });
    }

    // If the new table number is different from the current one, check for duplicates
    if (tableNumber !== currentTable.tableNumber) {
      const existingTable = await TableModel.findOne({
        tableNumber,
        sectionNumber,
      }).exec();

      if (existingTable) {
        return res.status(400).json({
          message: `Table number ${tableNumber} already exists in section ${sectionNumber}.`,
        });
      }
    }


    // Update the table data
    const updatedTable = await TableModel.findByIdAndUpdate(
      tableId,
      {
        $set: {
          sectionNumber,
          tableNumber,
          tableCode,
          chairs,
          isValid,
          status,
          location,
          notes,
          updatedBy,
        },
      },
      { new: true } // Return the updated document
    ).exec();

    return res.status(200).json({
      message: "Table updated successfully.",
      data: updatedTable,
    });
  } catch (err) {
    console.error("Error updating table:", err.message);

    return res.status(500).json({
      message: "An error occurred while updating the table.",
      error: err.message,
    });
  }
};

// Delete a table by ID
const deleteTable = async (req, res) => {
  const id = req.params.tableId;

  try {
    const deletedTable = await TableModel.findByIdAndDelete(id).exec();

    if (!deletedTable) {
      return res.status(404).json({
        message: "Table not found or already deleted",
      });
    }

    return res.status(200).json({
      message: "Table deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting table:", error.message);
    return res.status(500).json({
      message: "Error deleting table",
      error: error.message,
    });
  }
};

// Export all controller functions
module.exports = {
  createTable,
  createQR,
  showAllTables,
  showOneTable,
  updateTable,
  deleteTable,
};
