import mongoose from 'mongoose';

const ReferrerSchema = mongoose.Schema(
  {
    referralCode: {
      type: String,
      unique: true,
      required: [true, 'Referral Code is required'],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: [true, 'Referrer ID is required'],
    },
    referrers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Referral', ReferrerSchema);
