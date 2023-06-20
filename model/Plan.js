import mongoose from 'mongoose';

const PlanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Referral Code is required'],
    },
    profitPercentage: {
      type: Number,
      required: [true, 'Please add the profit for this plan'],
    },
    settlementInterval: {
      type: Number,
      required: [true, 'What is the interval for settlement'],
    },
    settlementType: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'hourly',
    },
    minAmount: {
      type: Number,
      required: [true, 'Minimum investment amount is required'],
    },
    maxAmount: {
      type: String,
      required: [true, 'Maximum investment amount is required'],
    },
    referrerBenefit: {
      type: Number,
      required: [true, 'Referrer benefit is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Plan', PlanSchema);
