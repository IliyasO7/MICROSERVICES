import mongoose from 'mongoose';

export const InvoiceType = {
  ODS: 'ods',
};

export const InvoiceTaxType = {
  CGST_SGST: 'cgst/sgst',
  IGST: 'igst',
};

export const InvoiceStatus = {
  DUE: 'due',
  PAID: 'paid',
};

const schema = new mongoose.Schema(
  {
    _id: { type: String },
    type: {
      type: String,
      enum: Object.values(InvoiceType),
      default: InvoiceType.ODS,
    },
    billFrom: {
      _id: { type: mongoose.Types.ObjectId, ref: 'user' },
      name: String,
      mobile: String,
      email: String,
      address: String,
      gst: String,
      pan: String,
      state: String,
    },
    billTo: {
      _id: { type: mongoose.Types.ObjectId, ref: 'user' },
      name: String,
      mobile: String,
      email: String,
      address: String,
      gst: String,
      pan: String,
      state: String,
    },
    items: [
      {
        description: String,
        hsn: String,
        quantity: Number,
        rate: Number,
        amount: Number,
      },
    ],
    taxType: { type: String, enum: Object.values(InvoiceTaxType) },
    tax1Percentage: Number,
    tax2Percentage: Number,
    tax1Amount: Number,
    tax2Amount: Number,
    taxPercentage: Number,
    taxAmount: Number,
    itemAmount: Number,
    totalAmount: Number,
    status: { type: String, enum: Object.values(InvoiceStatus) },
  },
  { _id: false, timestamps: true }
);

const Invoice = mongoose.model('invoice', schema);

export default Invoice;
