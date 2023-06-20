import Referral from '../model/Referral.js';

export const checkReferer = async (query) => {
  //Check if referral is valid and gets the referrer ID

  try {
    const referral = await Referral.findOne(query).populate({
      path: 'userId',
    });

    return referral;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const createReferral = async (referralBody) => {
  try {
    const referral = new Referral(referralBody);
    return await referral.save();
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const updateReferral = async (newUser, referrerCode) => {
  try {
    await Referral.findOneAndUpdate(
      { referrerCode },
      { $push: { referrers: newUser } }
    );
    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const giveReferrerCommission = async (amount, depositor, referrer) => {
  try {
    const percentage = amount * (5 / 100);
  } catch (error) {
    throw new Error(error);
  }
};
