import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { getAllPlans, createPlan, updatePlan, getPlan, deletePlan } from '../controllers/planController.js';
import Plan from '../model/Plan.js';

const route = express.Router();

route.get('/drop', async (req, res) => {
  await Plan.collection.drop();
  res.status(200).send('collection dropped');
});
route.route('/').get(getAllPlans).post(protect, admin, createPlan)
route.route('/:id').put(protect, admin, updatePlan).get(getPlan).delete(protect,admin,deletePlan)

export default route;