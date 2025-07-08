const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const helmet = require("helmet"); // Security middleware
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");

// Import database connection and route files
const connectdb = require("./database/connectdb.js");
const routeRestaurant = require("./router/Restaurant.router.js");
const routePermission = require("./router/Permission.router.js");
const routeAttendance = require("./router/AttendanceRecord.router.js");
const routeShift = require("./router/Shift.router.js");
const routePreparationSection = require("./router/PreparationSection.router.js");
const routePreparationTicket = require("./router/PreparationTicket.router.js");
const routeDeliveryArea = require("./router/DeliveryArea.router.js");
const routeReservation = require("./router/Reservation.router.js");
const routeMessage = require("./router/Message.router.js");
const routeAuth = require("./router/Auth.router.js");
const routeMenuCategory = require("./router/MenuCategory.router.js");
const routeProduct = require("./router/Product.router.js");
const routeRecipe = require("./router/Recipe.router.js");
const routeProductionRecipe = require("./router/ProductionRecipe.router.js");
const routeUser = require("./router/User.router.js");
const routeCustomer = require("./router/Customer.router.js");
const routeEmployee = require("./router/Employee.router.js");
const routePayroll = require("./router/PayRoll.router.js");
const routeEmployeeTransactions = require("./router/EmployeeTransactions.router.js");
const routeTable = require("./router/Table.router.js");
const routeOrder = require("./router/Order.router.js");
const routeCategoryStock = require("./router/CategoryStock.router.js");
const routeStockItems = require("./router/StockItem.router.js");
const routeSupplier = require("./router/Supplier.router.js");
const routeSupplierTransaction = require("./router/SupplierTransaction.router.js");
const routePurchase = require("./router/Purchase.router.js");
const routePurchaseReturn = require("./router/PurchaseReturnInvoice.router.js");
const routeStore = require("./router/Store.router.js");
const routeStockMovement = require("./router/StockMovement.router.js");
const routeConsumption = require("./router/Consumption.router.js");
const routeExpense = require("./router/Expense.router.js");
const routeDailyExpense = require("./router/DailyExpense.router.js");
const routeCashRegister = require("./router/CashRegister.router.js");
const routeCashMovement = require("./router/CashMovement.router.js");
const routeProductionOrder = require("./router/ProductionOrder.router.js");
const routeProductionRecord = require("./router/ProductionRecord.router.js");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectdb();

const app = express();
const frontEnd = process.env.FRONT_END_URL;

// Security middleware
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Middleware setup
app.use(express.json({ limit: "100kb" })); // Limit request body size
app.use(cookieParser()); // Parse cookies

app.set('trust proxy', 1);

// CORS setup
app.use(
  cors({
    origin: [
      "https://restaurant.menufy.tech",
      "https://www.restaurant.menufy.tech",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve static files
app.use("/", express.static("public"));
app.use("/images", express.static("images"));

// Simple test endpoint to check if the server is running
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100, // Limit each IP to 100 requests per window (1 minute)
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  trustProxy: false, // Disable trusting proxy headers
});
app.use("/api", limiter); // Apply rate limiting to all API routeS

// Route requests to appropriate routers
app.use("/api/restaurant", routeRestaurant);
app.use("/api/permission", routePermission);
app.use("/api/attendance", routeAttendance);
app.use("/api/shift", routeShift);
app.use("/api/preparationsection", routePreparationSection);
app.use("/api/preparationticket", routePreparationTicket);
app.use("/api/deliveryarea", routeDeliveryArea);
app.use("/api/product", routeProduct);
app.use("/api/recipe", routeRecipe);
app.use("/api/menucategory", routeMenuCategory);
app.use("/api/customer", routeCustomer);
app.use("/api/user", routeUser);
app.use("/api/employee", routeEmployee);
app.use("/api/message", routeMessage);
app.use("/api/payroll", routePayroll);
app.use("/api/employeetransactions", routeEmployeeTransactions);
app.use("/api/table", routeTable);
app.use("/api/order", routeOrder);
app.use("/api/auth", routeAuth);
app.use("/api/store", routeStore);
app.use("/api/categoryStock", routeCategoryStock);
app.use("/api/productionrecipe", routeProductionRecipe);
app.use("/api/stockitem", routeStockItems);
app.use("/api/supplier", routeSupplier);
app.use("/api/suppliertransaction", routeSupplierTransaction);
app.use("/api/purchaseinvoice", routePurchase);
app.use("/api/purchasereturn", routePurchaseReturn);
app.use("/api/stockmovement", routeStockMovement);
app.use("/api/consumption", routeConsumption);
app.use("/api/expenses", routeExpense);
app.use("/api/dailyexpense", routeDailyExpense);
app.use("/api/cashregister", routeCashRegister);
app.use("/api/cashMovement", routeCashMovement);
app.use("/api/reservation", routeReservation);
app.use("/api/productionorder", routeProductionOrder);
app.use("/api/productionrecord", routeProductionRecord);

const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
  cors: {
    origin: [
      "https://restaurant.menufy.tech",
      "https://www.restaurant.menufy.tech",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"],
  },
});

// Handle socket.io connections
// io.on('connect', (socket) => {
//   console.log('New client connected');

//   // Listen for new order notifications
//   socket.on('neworder', (notification) => {
//     console.log("Notification received:", notification); // Confirm receipt
//     // Emit the notification back to the client for testing purposes
//     socket.broadcast.emit('neworder', notification);
//   });
//   socket.on('orderkit', (notification) => {
//     console.log("Notification received:", notification); // Confirm receipt
//     // Emit the notification back to the client for testing purposes
//     socket.broadcast.emit('orderkit', notification);
//   });

//   socket.on('orderwaiter', (notification) => {
//     console.log("Notification received:", notification); // Confirm receipt
//     // Emit the notification back to the client for testing purposes
//     socket.broadcast.emit('orderwaiter', notification);
//   });

//   // Handle disconnect event
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

const cashierNamespace = io.of("/cashier");
const kitchenNamespace = io.of("/kitchen");
const BarNamespace = io.of("/bar");
const GrillNamespace = io.of("/grill");
const waiterNamespace = io.of("/waiter");

// التعامل مع اتصالات الكاشير
cashierNamespace.on("connection", (socket) => {
  console.log("Cashier connected");

  // استقبال إشعار من العميل إلى الكاشير
  socket.on("neworder", (notification) => {
    console.log("New order received:", notification);
    // إرسال الإشعار إلى المطبخ
    cashierNamespace.emit("neworder", notification);
  });

  socket.on("disconnect", () => {
    console.log("Cashier disconnected");
  });
});

// التعامل مع اتصالات المطبخ
kitchenNamespace.on("connection", (socket) => {
  console.log("Kitchen connected");

  socket.on("orderkitchen", (notification) => {
    console.log("Order ready notification:", notification);
    kitchenNamespace.emit("orderkitchen", notification);
  });

  socket.on("disconnect", () => {
    console.log("Kitchen disconnected");
  });
});

BarNamespace.on("connection", (socket) => {
  console.log("Bar connected");

  socket.on("orderBar", (notification) => {
    console.log("Order ready notification:", notification);
    BarNamespace.emit("orderBar", notification);
  });

  socket.on("disconnect", () => {
    console.log("Bar disconnected");
  });
});

GrillNamespace.on("connection", (socket) => {
  console.log("Grill connected");

  socket.on("orderGrill", (notification) => {
    console.log("Order ready notification:", notification);
    GrillNamespace.emit("orderGrill", notification);
  });

  socket.on("disconnect", () => {
    console.log("Grill disconnected");
  });
});

// التعامل مع اتصالات الويتر
waiterNamespace.on("connection", (socket) => {
  console.log("Waiter connected");

  socket.on("orderReady", (notification) => {
    console.log("Help request received:", notification);
    waiterNamespace.emit("orderReady", notification);
  });
  socket.on("helprequest", (notification) => {
    console.log("Help request received:", notification);
    waiterNamespace.emit("helprequest", notification);
  });

  socket.on("orderwaiter", (notification) => {
    console.log("Order ready notification:", notification);
    waiterNamespace.emit("orderwaiter", notification);
  });

  socket.on("disconnect", () => {
    console.log("Waiter disconnected");
  });
});

const port = process.env.PORT || 8000;

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
