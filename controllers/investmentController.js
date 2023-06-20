// required admin/user privilege
import joi from 'joi';
import { conn } from '../config/db.js';
import Investment from '../model/Investment.js';
import Plan from '../model/Plan.js';
import User from '../model/User.js';
import mongoose from 'mongoose';
import _ from 'lodash';

export const createInvestment = async (req, res) => {
  const valid = investmentValidation(req.body);
  if (valid.isError) return res.status(400).json(valid.result);
  try {
    const plan = await Plan.findOne({ _id: valid.result.plan });
    if (valid.result.amount < plan.minAmount) {
      return res.status(400).json({
        error: `The minimum amount for the ${plan.name} is ${plan.minAmount}, please select suited plan`,
      });
    }
    if (valid.result.amount > +plan.maxAmount) {
      return res.status(400).json({
        error: `The maxinium amount for the ${plan.name} is ${plan.maxAmount}, please select suited plan`,
      });
    }
    const investment = await Investment.create(valid.result);
    return res.status(201).json(investment);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

// required admin/user privilege
export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({});
    return res.status(200).json(investments);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

// required admin/user privilege
export const getInvestment = async (req, res) => {
  try {
    const investments = await Investment.findById(req.params.id);
    return res.status(200).json(investments);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

// required admin/user privilege
export const getUserInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({
      userId: req.params.userId,
    }).populate('plan');
    return res.status(200).json(investments);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

export const updateInvestment = async (req, res) => {
  try {
    let payload;
    let investment = await Investment.findOne({ _id: req.params.id });
    investment = investment.toObject();
    investment = _.omit(
      {
        ...investment,
        plan: new mongoose.Types.ObjectId(investment.plan).toString(),
        user: new mongoose.Types.ObjectId(investment.user).toString(),
      },
      '_id',
      '__v',
      'createdAt',
      'updatedAt',
      'totalSettledAmount',
      'status'
    );
    if (investment) {
      payload = { ...investment, ...req.body };
    }
    const valid = investmentValidation(payload);
    if (valid.isError) return res.status(400).json(valid.result);

    const updatedInvestment = await Investment.findOneAndUpdate(
      { _id: req.params.id },
      valid.result,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedInvestment);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

export const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findByIdAndDelete(req.params.id);
    return res.status(200).json(investment);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

export const confirmInvestment = async (req, res) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const investment = await Investment.findOne({ _id: req.params.id });

    if (investment?.status === 'confirmed') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Investment already confirmed' });
    }

    investment.status = 'confirmed';

    await investment.save({ session });

    const user = await User.findOne({ _id: investment.user }).session(session);
    const plan = await Plan.findOne({ _id: investment.plan }).session(session);

    if (user?.referedBy) {
      const referrerPercentage =
        investment.amount * (plan.referrerBenefit / 100);
      await User.findOneAndUpdate(
        { _id: user.referedBy },
        {
          $inc: { bonusBalance: referrerPercentage },
        },
        { new: true }
      ).session(session);
    }

    res.status(200).json(investment);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).send('Network error');
  }
};

const investmentValidation = (body) => {
  const schema = joi.object({
    plan: joi.string().required(),
    user: joi.string().required(),
    amount: joi.number().required(),
  });
  const result = schema.validate(body);
  if (result.error) return { isError: true, result: result.error.details };
  else return { isError: false, result: result.value };
};
