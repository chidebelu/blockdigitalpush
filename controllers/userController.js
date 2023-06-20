import asyncHandler from 'express-async-handler';
import User from '../model/User.js';
import Referral from '../model/Referral.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import { customAlphabet as generate } from 'nanoid';
import genRandomNumber from '../utils/genRandomNumber.js';
import { conn } from '../config/db.js';
import getFirstLetter from '../utils/getFirstLetter.js';

const CHARACTER_SET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const REFERRAL_CODE_LENGTH = 8;

const referralCode = generate(CHARACTER_SET, REFERRAL_CODE_LENGTH);

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.matchPassword(password))) {
    const newUser = user.toObject();
    res.json({
      ...newUser,
      password: undefined,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, bitcoin, password, referralCode, bnb, usdt, ethereum } =
    req.body;
    console.log(req.body)
  const session = await conn.startSession();
  try {
    session.startTransaction();

    const userExists = await User.findOne({ email }).session(session);

    if (userExists) {
      await session.abortTransaction();
      return res.status(400).send('User already exists');
    }

    const user = new User({
      firstname,
      lastname,
      email,
      bitcoin,
      ethereum,
      usdt,
      bnb,
      referralCode,
      password,
    });

    let refId = getFirstLetter([firstname, lastname]) + genRandomNumber(); //Generate unique id for the user.

    const referrerResponse = await Referral.create(
      [
        {
          userId: user._id,
          referralCode: refId,
        },
      ],
      { session }
    );

    if (referralCode) {
      const ref = await Referral.findOneAndUpdate(
        { referralCode },
        { $push: { referrers: user._id } }
      ).session(session);
      if (ref) user.referedBy = ref.userId;
    }

    await user.save({ session });

    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
      usdt: user.usdt,
      bitcoin: user.bitcoin,
      ethereum: user.ethereum,
      bnb: user.bnb,
      referralCode: referrerResponse[0].referralCode,
      token: generateToken(user._id),
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  } finally {
    session.endSession();
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  let user = await User.findById(req.user._id).select('-password');
  if (user) {
    user = user.toObject();
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

export const updateRoleAdmin = asyncHandler(async (req, res) => {
  let user = await User.findByIdAndUpdate(
    req.params.userId,
    { isAdmin: true },
    { new: true }
  ).select('-password');
  if (user) {
    user = user.toObject();
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

const updatedUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;
    user.bitcoin = req.body.bitcoin || user.bitcoin;
    user.ethereum = req.body.ethereum || user.ethereum;
    user.usdt = req.body.usdt || user.usdt;
    user.bnb = req.body.bnb || user.bnb;
    user.about = req.body.about || user.about;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      bitcoin: updatedUser.bitcoin,
      ethereum: updatedUser.ethereum,
      usdt: updatedUser.usdt,
      bnb: updatedUser.bnb,
      about: updatedUser.about,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;
    user.bitcoin = req.body.bitcoin || user.bitcoin;
    user.ethereum = req.body.ethereum || user.ethereum;
    user.usdt = req.body.usdt || user.usdt;
    user.bnb = req.body.bnb || user.bnb;
    user.isAdmin = req.body.isAdmin;
    user.accountBalance = req.body.accountBalance;
    user.totaldeposit = req.body.totaldeposit;
    user.referralBonus = req.body.referralBonus;
    user.totalwithdrew = req.body.totalwithdrew;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      bitcoin: updatedUser.bitcoin,
      ethereum: updatedUser.ethereum,
      usdt: updatedUser.usdt,
      bnb: updatedUser.bnb,
      isAdmin: updatedUser.isAdmin,
      accountBalance: updatedUser.accountBalance,
      referralbonus: updatedUser.referralbonus,
      totaldeposit: updatedUser.totaldeposit,
      totalwithdrew: updatedUser.totalwithdrew,
    });
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('No email could not be sent', 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    // HTML Message
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      });

      res.status(200).json({ success: true, data: 'Email Sent' });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid Token', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: 'Password Updated Success',
      token: user.getSignedJwtToken(),
    });
  } catch (err) {
    next(err);
  }
});

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ sucess: true, token });
};

export {
  authUser,
  registerUser,
  getUserProfile,
  updatedUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  resetPassword,
  forgotPassword,
  sendToken,
};
