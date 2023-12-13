import * as mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  date: String,
});

export const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: Number,
  agency: String,
  kindAccount: String,
  accountNumber: String,
  creationDate: String,
  lastUpdatedDate: String,
  transactions: {
    type: [TransactionSchema], 
    default: [],
  },
});

export const UserModel = mongoose.model('User', UserSchema);
