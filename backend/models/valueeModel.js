import mongoose from 'mongoose';

const valueeSchema = new mongoose.Schema(
  {
    codVal: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Valuee = mongoose.model('Valuee', valueeSchema);
export default Valuee;
