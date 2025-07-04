const EmployeeModel = require("../models/Employee.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Joi = require("joi");

const createFirstEmployee = async (req, res) => {
  try {
    // Check if there are any employees in the database
    const employeeCount = await EmployeeModel.countDocuments();
    // If there are employees, return an error
    if (employeeCount > 0) {
      return res.status(400).json({ message: "First employee already created" });
    }
    console.log("Received request to create first employee");

    const defaultEmployeeData = {
      fullname: "Beshoy Nady",
      phone: "01122455010",
      role: "programer",
      username: "BeshoyNady",
      isActive: true,
      isAdmin: true,
      isVerified: true,
    };

    const hashedPassword = await bcrypt.hash('Beshoy@88', 10);
    
    // Logging before creation to check data
    console.log("Creating employee with data:", { ...defaultEmployeeData, password: hashedPassword });
    
    const newEmployee = await EmployeeModel.create({
      ...defaultEmployeeData,
      password: hashedPassword,
    });

    console.log("New employee created:", newEmployee);
    return res.status(201).json({ newEmployee });

  } catch (err) {
    console.error("Error creating the first employee:", err);
    return res.status(500).json({ message: "Error creating the first employee", err: err.message });
  }
};





const createEmployeeSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).required(),
  numberID: Joi.string()
    .length(14)
    .when("role", {
      is: Joi.not("programer").valid(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  username: Joi.string()
    .min(3)
    .max(100)
    .when("role", {
      is: Joi.not("programer").valid(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  address: Joi.string().min(3).max(200).optional(),
  email: Joi.string().email().max(100).allow(""),
  phone: Joi.string().length(11).required(),
  password: Joi.string().min(3).max(200).required(),
  basicSalary: Joi.number()
    .min(0)
    .when("role", {
      is: Joi.not("programer").valid(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  role: Joi.string()
    .valid(
      "programer",
      "owner",
      "manager",
      "cashier",
      "waiter",
      "deliveryman",
      "chef",
      "Bartender",
      "Grill Chef",
    )
    .required(),
  isActive: Joi.boolean().default(true),
  shift: Joi.string().when("role", {
    is: Joi.not("programer").valid(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  workingDays: Joi.number()
    .min(0)
    .max(31)
    .when("role", {
      is: Joi.not("programer").valid(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  taxRate: Joi.number()
    .min(0)
    .max(100)
    .when("role", {
      is: Joi.not("programer").valid(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  insuranceRate: Joi.number()
    .min(0)
    .max(100)
    .when("role", {
      is: Joi.not("programer").valid(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  isAdmin: Joi.boolean().default(true),
  isVerified: Joi.boolean().default(false),
  sectionNumber: Joi.string().allow("").optional(),
});



const createEmployee = async (req, res) => {
  try {
    const createdBy = req.employee.id;
    const { error } = createEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      fullname,
      numberID,
      username,
      shift,
      email,
      address,
      phone,
      workingDays,
      basicSalary,
      role,
      sectionNumber,
      taxRate,
      insuranceRate,
      isActive,
    } = req.body;

    if (!fullname) {
      return res.status(400).json({ message: "Invalid input: Fullname " });
    }
    if (!phone) {
      return res.status(400).json({ message: "Invalid input: Phone" });
    }
    if (!numberID) {
      return res.status(400).json({ message: "Invalid input: numberID " });
    }
    if (!req.body.password) {
      return res
        .status(400)
        .json({ message: "Invalid input: password missing" });
    }

    const isEmployeeFound = await EmployeeModel.findOne({ phone });
    if (isEmployeeFound) {
      return res.status(409).json({ message: "This phone is already in use" });
    }

    const isEmployeeNumberIDFound = await EmployeeModel.findOne({ numberID });
    if (isEmployeeNumberIDFound) {
      return res
        .status(409)
        .json({ message: "This numberID is already in use" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newEmployee = await EmployeeModel.create({
      fullname,
      username,
      numberID,
      email,
      shift,
      phone,
      address,
      password: hashedPassword,
      workingDays,
      basicSalary,
      role,
      sectionNumber,
      taxRate,
      insuranceRate,
      isActive,
      createdBy,
    });

    res.status(201).json({ newEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error creating employee", err });
  }
};

const updateEmployeeSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).required(),
  numberID: Joi.string().length(14).required(),
  username: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(200).required(),
  email: Joi.string().email().max(100).allow(""),
  phone: Joi.string().length(11).required(),
  password: Joi.string().min(3).max(200).optional(),
  basicSalary: Joi.number().min(0).required(),
  role: Joi.string()
    .valid(
      "programer",
      "owner",
      "manager",
      "cashier",
      "waiter",
      "deliveryman",
      "chef",
      "Bartender",
      "Grill Chef",
    )
    .required(),
  isActive: Joi.boolean().optional(),
  shift: Joi.string().optional(),
  workingDays: Joi.number().min(0).max(31).optional(),
  taxRate: Joi.number().min(0).max(100).optional(),
  insuranceRate: Joi.number().min(0).max(100).optional(),
  isAdmin: Joi.boolean().default(true),
  isVerified: Joi.boolean().default(false),
  sectionNumber: Joi.number().optional(),
});

const updateEmployee = async (req, res) => {
  try {
    const updatedBy = req.employee.id;
    const id = req.params.employeeId;
    const { error } = updateEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      fullname,
      numberID,
      username,
      shift,
      email,
      address,
      phone,
      workingDays,
      basicSalary,
      role,
      sectionNumber,
      taxRate,
      insuranceRate,
      isActive,
      isVerified,
      password,
    } = req.body;

    const updateData = {
      fullname,
      numberID,
      username,
      shift,
      email,
      address,
      phone,
      workingDays,
      basicSalary,
      role,
      sectionNumber,
      taxRate,
      insuranceRate,
      isActive,
      isVerified,
      updatedBy,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", err });
    console.log({ message: "Error updating employee", err });
  }
};

const getOneEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await EmployeeModel.findById(employeeId)
      .populate("shift")
      .populate("createdBy", "_id fullname username role")
      .populate("updatedBy", "_id fullname username role");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", err });
  }
};



const loginEmployee = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    const findEmployee = await EmployeeModel.findOne({ phone });

    if (!findEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!findEmployee.isActive) {
      return res.status(403).json({ message: "Employee is not active" });
    }

    const match = await bcrypt.compare(password, findEmployee.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        id: findEmployee._id,
        username: findEmployee.username,
        isAdmin: findEmployee.isAdmin,
        isActive: findEmployee.isActive,
        isVerified: findEmployee.isVerified,
        role: findEmployee.role,
        shift: findEmployee.shift,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: findEmployee._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } 
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      findEmployee
    });
  } catch (error) {
    console.error("Error logging in:", error);

    if (error instanceof mongoose.Error) {
      return res.status(500).json({ message: "Database error occurred while processing your request. Please try again later." });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(500).json({ message: "Token generation failed. Please try again later." });
    }

    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const employees = await EmployeeModel.find()
      .populate("shift")
      .populate("createdBy", "_id fullname username role")
      .populate("updatedBy", "_id fullname username role");
      // console.log("Employees: ", employees);
    res.status(200).json(employees);
  } catch (err) {
    if (err instanceof mongoose.Error) {
      return res.status(500).json({
        message: "Database error occurred while fetching employees. Please try again later.",
        error: err.message,
      });
    }
    res.status(500).json({
      message: "Internal server error. Please try again later.",
      error: err.message,
    });
  }
};

const getCountEmployees = async (req, res) => {
  try {
    // Count the number of employees
    const employeeCount = await EmployeeModel.countDocuments();
    // Return the count in the response
    res.status(200).json({ count: employeeCount });
  } catch (err) {
    // Handle errors occurred during the process
    console.error("Error counting employees:", err);
    res
      .status(500)
      .json({ message: "An error occurred while counting employees", err });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res
      .status(200)
      .json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", err });
  }
};

module.exports = {
  createFirstEmployee,
  createEmployee,
  updateEmployee,
  getOneEmployee,
  loginEmployee,
  getAllEmployee,
  getCountEmployees,
  deleteEmployee,
};
