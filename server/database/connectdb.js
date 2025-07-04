const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
const url = process.env.MONGODB_URL;

// Function to connect to the database
const connectDB = async () => {
    try {
        // Attempt to connect to the database
        await mongoose.connect(url, {
            useNewUrlParser: true, // Use the new URL parser
            useUnifiedTopology: true, // Use the unified topology layer
            serverSelectionTimeoutMS: 30000, // Timeout duration for server selection
            connectTimeoutMS: 10000, // Timeout duration for connection
        });
        console.log('Database connection successful');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        await mongoose.disconnect(); // Disconnect in case of an error
    }
};

// Export the connection function
module.exports = connectDB;
