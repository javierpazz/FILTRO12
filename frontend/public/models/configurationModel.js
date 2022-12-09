import mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema(
  {
    codCon: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Configuration = mongoose.model('Configuration', configurationSchema);
export default Configuration;
