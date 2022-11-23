import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Открыт"
    },
    Created: {
      type: String,
    },
    LastLogin: {
      type: String,
      default: new Date().toLocaleString(),
    }
  },
);

export default mongoose.model('User', UserSchema);