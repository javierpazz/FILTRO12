import mongoose from 'mongoose';

const valueeSchema = new mongoose.Schema(
  {
    codVal: { type: Number, required: true },
    desVal: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Valuee = mongoose.model('Valuee', valueeSchema);
export default Valuee;
