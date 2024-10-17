import express from 'express';
import { addAddress, getAddress, getAddressById, updateAddress, deleteAddress } from '../controller/addressController.js';
import authMiddleWare from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleWare,  addAddress);
router.get('/',  getAddress);
router.get('/:id',  getAddressById);
router.patch('/:id', authMiddleWare,  updateAddress);
router.delete('/:id', authMiddleWare,  deleteAddress);

export default router;