const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
      trim: true,
    },
    locationUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "Please enter a valid URL"],
    },
    aboutText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    address: {
      country: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      street: {
        type: String,
        required: true,
        trim: true,
      },
      postal_code: {
        type: String,
        trim: true,
      },
    },
    contact: {
      phone: [
        {
          type: String,
          trim: true,
          match: [
            /^(\+?\d{1,4}[-\s]?)?\d{11}$/,
            "Please enter a valid phone number",
          ],
        },
      ],
      whatsapp: {
        type: String,
        trim: true,
        match: [
          /^(\+?\d{1,4}[-\s]?)?\d{11}$/,
          "Please enter a valid phone number",
        ],
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
      },
    },
    social_media: [
      {
        platform: {
          type: String,
          required: true,
          trim: true,
          enum: ["facebook", "twitter", "instagram", "linkedin", "youtube"],
        },
        url: {
          type: String,
          required: true,
          trim: true,
          match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "Please enter a valid URL"],
        },
      },
    ],
    opening_hours: [
      {
        day: {
          type: String,
          required: true,
          enum: [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
        },
        from: String,
        to: String,
        closed: Boolean,
      },
    ],
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "Please enter a valid URL"],
    },
    acceptedPayments: {
      type: [String],
      enum: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "Vodafone Cash",
        "Etisalat Cash",
        "Orange Cash",
        "Fawry",
        "Meeza",
        "PayPal",
        "Aman",
        "Other",
      ],
      default: "Cash",
    },
    features: {
      type: [String],
      enum: [
        "WiFi",
        "Parking",
        "Outdoor Seating",
        "Wheelchair Accessible",
        "Live Music",
        "Pet Friendly",
        "Kids Friendly",
        "Other",
      ],
    },
    dineIn: {
      type: Boolean,
      required: true,
      default: false,
    },
    takeAway: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveryService: {
      type: Boolean,
      required: true,
      default: false,
    },
    usesReservationSystem: {
      type: Boolean,
      required: true,
      default: false,
    },
    salesTaxRate: {
      type: Number,
      required: true,
      default: 0,
    },
    serviceTaxRate: {
      type: Number,
      required: true,
      default: 0,
    },
    subscriptionStart: {
      type: Date,
    },
    subscriptionEnd: {
      type: Date,
    },
  },
  { timestamps: true }
);

const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);

module.exports = RestaurantModel;
