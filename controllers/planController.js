import joi from 'joi';
import Plan from '../model/Plan.js';
import _ from 'lodash';

// unprotected
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    return res.status(200).json(plans);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

// required admin privilege
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.deleteOne({ _id: req.params.id });
    return res.status(200).json(plan);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

// required admin privilege
export const updatePlan = async (req, res) => {
  try {
    let payload;
    let plan = await Plan.findById(req.params.id);
    plan = _.omit(plan.toObject(), '_id', '__v', 'createdAt', 'updatedAt');
    if (plan) payload = { ...plan, ...req.body };

    const validate = planValidation(payload);

    if (validate.isError) return res.status(400).json(validate.result);

    const updatedPlan = await Plan.findOneAndUpdate(
      { _id: req.params.id },
      validate.result,
      { new: true, runValidators: true }
    );
    return res.status(201).json(updatedPlan);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

// unprotected
export const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    return res.status(200).json(plan);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

// required admin privilege
export const createPlan = async (req, res) => {
  const validate = planValidation(req.body);
  if (validate.isError) return res.status(400).json(validate.result);

  try {
    const plan = await Plan.create(validate.result);
    return res.status(201).json(plan);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

const planValidation = (body) => {
  const schema = joi.object({
    name: joi.string().required(),
    profitPercentage: joi.number().required(),
    settlementInterval: joi.number().required(),
    settlementType: joi
      .string()
      .optional()
      .valid('hourly', 'daily', 'weekly', 'monthly', 'yearly'),
    minAmount: joi.number().required(),
    maxAmount: joi.string().required(),
    referrerBenefit: joi.number().required(),
  });

  const result = schema.validate(body);
  if (result.error) return { isError: true, result: result.error.details };
  else return { isError: false, result: result.value };
};
