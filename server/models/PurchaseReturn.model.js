const mongoose = require('mongoose');

const purchaseReturnInvoiceSchema = new mongoose.Schema({
    originalInvoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseInvoice',
        required: true,
        description: 'رقم الفاتورة الأصلية التي تتعلق بها عملية المرتجع'
    },
    returnDate: {
        type: Date,
        default: Date.now,
        required: true,
        description: 'تاريخ عملية المرتجع'
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
        description: 'المورد الذي تمت له عملية المرتجع'
    },
    returnedItems: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StockItem',
            required: true,
            description: 'معرف الصنف المرتجع'
        },
        quantity: { type: Number, required: true, description: 'الكمية المرتجعة للصنف' },
        storageUnit: { type: String, required: true, description: 'وحدة القياس الكبرى للصنف' },
        price: { type: Number, required: true, description: 'سعر الصنف المرتجع' },
        cost: { type: Number, required: true, description: 'تكلفة الصنف المرتجع' },
        expirationDate: { type: Date, description: 'تاريخ انتهاء صلاحية الصنف المرتجع' }
    }],
    totalAmount: {
        type: Number,
        required: true,
        description: 'إجمالي قيمة المرتجع'
    },
    discount: { type: Number, default: 0, description: 'قيمة الخصم المطبقة على المرتجع إن وجدت' },
    salesTax: { type: Number, description: 'ضريبة المبيعات المطبقة على المرتجع إن وجدت' },
    netAmount: { type: Number, required: true, description: 'المبلغ الصافي المستحق للمرتجع' },
    refundedAmount: { type: Number, default: 0, description: 'المبلغ المسترد للمرتجع إن وجد' },
    balanceDue: { type: Number, required: true, default: 0, description: 'المبلغ المتبقي للدفع بعد عملية المرتجع' },
    paymentDueDate: { type: Date, default: null, description: 'تاريخ استحقاق الدفع للمرتجع' },
    additionalCost: { type: Number, description: 'التكاليف الإضافية المرتبطة بعملية المرتجع إن وجدت' },
    cashRegister: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CashRegister',
        required: false
    },
    returnStatus: {
        type: String,
        enum: ['unreturned', 'partially_returned', 'fully_returned'],
        default: 'unreturned',
    },
    paymentMethod: {
        type: String,
    },
    refundMethod: { 
        type: String,
        enum: ['cash', 'credit', 'deduct_supplier_balance'],
        default: 'cash',
    },
    notes: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    }
}, {
    timestamps: true
});

const PurchaseReturnInvoiceModel = mongoose.model('PurchaseReturnInvoice', purchaseReturnInvoiceSchema);
module.exports = PurchaseReturnInvoiceModel;
