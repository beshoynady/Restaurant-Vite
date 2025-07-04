const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    email: {
        type: String,
        maxlength: 100,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'يرجى إدخال عنوان بريد إلكتروني صحيح'],
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'password is required'],
        maxlength: 200,
        minlength: 3,
    },
    deliveryArea: {
        type: ObjectId,
        ref: 'DeliveryArea',
        required: [true, 'deliveryArea is required']
    },
    address: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 150,
    },
    phone: {
        type: String,
        unique: true,
        required: [true, 'phone is required'],
        trim: true,
        minlength: 11,
        maxlength: 11,
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
);

const Usermodel = mongoose.model('User', userschema);

module.exports = Usermodel;
