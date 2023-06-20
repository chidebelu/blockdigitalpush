import mongoose from 'mongoose';

const InvestmentSchema = mongoose.Schema(
  {
    // plan: {
    //   type: mongoose.Types.ObjectId,
    //   ref: 'Plan',
    //   required: [true, 'You most select a plan to invest on'],
    // },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Referrer ID is required'],
    },
    amount: {
      type: Number,
      required: true,
    },
    lastSettlementSession: {
      type: Date,
    },
    nextSettlementSession: {
      type: Date,
    },
    totalSettledAmount: {
      type: Number,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'failed', 'pending'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Investment', InvestmentSchema);
