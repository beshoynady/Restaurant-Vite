const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      minlength: [2, "Name must have at least 2 characters"],
    },

    description: {
      type: String,
      maxlength: [100, "Description cannot exceed 100 characters"],
      minlength: [3, "Description must have at least 3 characters"],
      default: "",
    },

    category: {
      type: ObjectId,
      ref: "menuCategory",
      required: [true, "Category is required"],
    },

    preparationSection: {
      type: ObjectId,
      ref: 'PreparationSection',
      required: [true, "Preparation section is required"],
      description: "Defines the section responsible for preparing the product",
    },

    quantity: {
      type: Number,
      default: 0,
      required: [true, "Quantity is required"],
    },

    hasSizes: {
      type: Boolean,
      required: true,
      default: false,
    },
    sizes: [
      {
        sizeName: {
          type: String,
          trim: true,
        },
        sizeRecipe: {
          type: ObjectId,
          ref: "Recipe",
        },
        sizeQuantity: {
          type: Number,
          default: 0,
          required: true,
        },
        sizePrice: {
          type: Number,
          required: [true, "Price is required"],
          max: [10000, "Price cannot exceed 10000"],
          min: [0, "Price cannot be negative"],
        },
        sizeDiscount: {
          type: Number,
          required: [true, "Discount is required"],
          min: [0, "Discount cannot be negative"],
          default: 0,
          validate: {
            validator: function (v) {
              return v >= 0;
            },
            message: (props) =>
              `${props.value} is not a valid value for discount`,
          },
        },
        sizePriceAfterDiscount: {
          type: Number,
          min: [0, "Price after discount cannot be negative"],
          default: 0,
        },
      },
    ],
    isAddon: {
      type: Boolean,
      default: false,
    },
    hasExtras: {
      type: Boolean,
      default: false,
    },
    extras: {
      type: [ObjectId],
      ref: "Product",
    },
    isCombo: {
      type: Boolean,
      default: false,
    },

    comboItems: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    productRecipe: {
      type: ObjectId,
      ref: "Recipe",
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "Price is required"],
      max: [10000, "Price cannot exceed 10000"],
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: [0, "Discount cannot be negative"],
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: (props) => `${props.value} is not a valid value for discount`,
      },
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Price after discount cannot be negative"],
      default: 0,
    },

    numberofcomments: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
