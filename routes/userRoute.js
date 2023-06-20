import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updatedUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  updateRoleAdmin,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../model/User.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.get('/drop', async (req, res) => {
  await User.collection.drop();
  res.status(200).send('collection dropped');
});
router.route('/allusers').get(protect, admin, getUsers);
router.route('/update-to-admin/:userId').get(protect, updateRoleAdmin);
router.route('/profile').get(protect, getUserProfile);
router.route('/forgotpassword').post(forgotPassword);
router.route('/profile/:id').put(protect, updatedUserProfile);
router.route('/passwordreset/:resetToken').put(resetPassword);
router
  .route('/:id')
  .delete(protect, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
