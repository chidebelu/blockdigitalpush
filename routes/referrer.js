import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  deleteReferral,
  getReferral,
  getReferrals,
  getUserReferrers,
} from '../controllers/referralController.js';
import Referral from '../model/Referral.js';

const route = express.Router();

route.get('/drop', async (req, res) => {
  await Referral.collection.drop();
  res.status(200).send('collection dropped');
});

route.get('/user-referrers/:userId', protect, getUserReferrers);

route.get('/', protect, admin, getReferrals);
route
  .route('/:id')
  .get(protect, admin, getReferral)
  .delete(protect, admin, deleteReferral);

export default route;
