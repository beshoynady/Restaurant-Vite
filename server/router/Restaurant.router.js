const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateSubscriptionDates,
} = require("../controllers/Restaurant.controller");

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require("../utlits/checkSubscription");

const imagesDir = path.join(__dirname, "..", "images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // تحديد الحد الأقصى لحجم الملف بـ 1 ميجابايت
  },
  fileFilter: (req, file, cb) => {
    // السماح بأنواع الصور فقط
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG file types are allowed."));
    }
  },
});

const deleteOldImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log("Old image deleted successfully");
  }
};

const deleteOldImageMiddleware = async (req, res, next) => {
  try {
    console.log("Middleware triggered");
    const restaurantId = req.params.id;
    if (!restaurantId) {
      return res.status(400).json({ message: "Product ID is missing" });
    }

    // استدعاء getOneProduct بشكل صحيح
    const restaurantResponse = await getRestaurant(
      { params: { id: restaurantId } },
      res
    );
    const restaurant = restaurantResponse.restaurant;

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "restaurant not found to delete OldImage" });
    }

    if (restaurant.image && req.file) {
      const oldImagePath = path.join(imagesDir, restaurant.image);
      console.log("Deleting old image:", oldImagePath);
      deleteOldImage(oldImagePath);
    }

    next();
  } catch (err) {
    console.error("Error deleting old image", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

router
  .route("/")
  .post(authenticateToken, upload.single("image"), createRestaurant)
  .get(getAllRestaurants);

router
  .route("/:id")
  .get(authenticateToken, checkSubscription, getRestaurantById)
  .put(
    authenticateToken,
    checkSubscription,
    upload.single("image"),
    deleteOldImageMiddleware,
    updateRestaurant
  )
  .delete(authenticateToken, checkSubscription, deleteRestaurant);

router
  .route("/update-subscription/:id")
  .put(authenticateToken, updateSubscriptionDates);

module.exports = router;
