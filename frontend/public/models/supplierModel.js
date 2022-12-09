import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    codSup: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
