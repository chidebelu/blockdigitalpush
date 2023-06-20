import Referral from '../model/Referral.js';

//admin
export const getReferrals = async (req, res) => {
  try {
    const referrers = await Referral.find({});
    return res.status(200).json(referrers);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

//admin
export const getReferral = async (req, res) => {
  try {
    const referrer = await Referral.findById(req.params.id);
    return res.status(200).json(referrer);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

export const getUserReferrers = async (req, res) => {
  try {
    const referrer = await Referral.find({
      userId: req.params.userId,
    }).populate('referrers');

    return res.status(200).json(referrer);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};

export const deleteReferral = async (req, res) => {
  try {
    const referrer = await Referral.findByIdAndDelete(req.params.id);
    return res.status(200).json(referrer);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Network error');
  }
};
