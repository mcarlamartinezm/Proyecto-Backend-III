import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number
  },
  password: {
    type: String,
    required: true
  },
  role: { //rol del usuario para control de acceso basado e roles (RBAC)
    type: String,
    enum: ['user', 'admin'], //valores permitidos
  default: 'user'
  }
});

export const UserModel = mongoose.models.users || mongoose.model('users', userSchema);