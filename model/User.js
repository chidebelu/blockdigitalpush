import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'please provide your firstname'],
    },
    lastname: {
      type: String,
      required: [true, 'please provide your lastname'],
    },
    email: {
      type: String,
      required: [true, 'email address'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    accountBalance: { type: Number, default: 0.0 },
    totaldeposit: { type: Number, default: 0.0 },
    totalwithdrew: { type: Number, default: 0.0 },
    referralbonus: { type: Number, default: 0.0 },
    bitcoin:{
      type: String,
      required: [true, 'please provide your bitcoin address'],
    }
    ,
    ethereum:{
      type: String,
      required: [true, 'please provide your ethereum address'],
    },
    
    usdt:{
      type: String,
      required: [true, 'please provide your usdt address'],
    },

    bnb:{
      type: String,
      required: [true, 'please provide your bnb address'],
    },

    about:{
      type: String,
      default:""
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    referedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    password: {
      type: String,
      required: [true, 'please provide your password'],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
