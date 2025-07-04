const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const router = express.Router();

const {authenticateToken} = require("../utlits/authenticate");;
const checkSubscription = require('../utlits/checkSubscription');
const {
  createProduct,
  getAllProducts,
  getProductByCategory,
  getOneProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/Product.controller");



const imagesDir = path.join(__dirname, '..', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG file types are allowed.'));
    }
  },
});

// إدارة الصور القديمة
const deleteOldImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log('Old image deleted successfully');
  }
};

// Middleware لحذف الصورة القديمة إذا كانت هناك صورة جديدة يتم رفعها
const deleteOldImageMiddleware = async (req, res, next) => {
  try {
    console.log('Middleware triggered');
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is missing' });
    }

    // استدعاء getOneProduct بشكل صحيح
    const productResponse = await getProduct({ params: { productId: productId } }, res);
    const product = productResponse.product;  // افترض أن getOneProduct تعيد product داخل response

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.image && req.file) {
      const oldImagePath = path.join(imagesDir, product.image);
      console.log('Deleting old image:', oldImagePath);
      deleteOldImage(oldImagePath);
    }

    next();
  } catch (err) {
    console.error('Error deleting old image', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteImageProductMiddleware = async (req, res, next) => {
  try {
    console.log('Middleware triggered');
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is missing' });
    }

    // استدعاء getOneProduct بشكل صحيح
    const productResponse = await getProduct({ params: { productId: productId } }, res);
    const product = productResponse.product;  
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.image) {
      const oldImagePath = path.join(imagesDir, product.image);
      console.log('Deleting old image:', oldImagePath);
      deleteOldImage(oldImagePath);
    }

    next();
  } catch (err) {
    console.error('Error deleting old image', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


router.route('/')
  .post(authenticateToken, checkSubscription, upload.single("image"), createProduct)
  .get(getAllProducts);

router.route('/getproductbycategory/:categoryid')
  .get(getProductByCategory);

router.route('/:productId')
  .get(getOneProduct)
  .put(authenticateToken, checkSubscription, upload.single("image"), deleteOldImageMiddleware, updateProduct)
  .delete(authenticateToken, checkSubscription, deleteImageProductMiddleware, deleteProduct);


module.exports = router;
