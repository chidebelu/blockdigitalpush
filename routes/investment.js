import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import Investment from '../model/Investment.js';
import {
  confirmInvestment,
  createInvestment,
  deleteInvestment,
  getInvestment,
  getInvestments,
  getUserInvestments,
  updateInvestment,
} from './../controllers/investmentController.js';

const route = express.Router();

route.get('/drop', async (req, res) => {
  await Investment.collection.drop();
  res.status(200).send('collection dropped');
});

route.put('/confirm-investment/:id', protect, admin, confirmInvestment);

route.get('/user-investments/:userId', protect, getUserInvestments);

route.route('/').get(protect, getInvestments).post(protect, createInvestment);
route
  .route('/:id')
  .put(protect, admin, updateInvestment)
  .get(protect, getInvestment)
  .delete(protect, admin, deleteInvestment);

export default route;
