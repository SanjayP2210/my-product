import express from 'express';

import { postRequest, getAll, patchRequest, putRequest, deleteRequest, getOne } from '../controller/commonController.js';
import Variant from '../models/Variant.js';
import authMiddleWare from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/',authMiddleWare,  postRequest(Variant, 'Variant'));
router.get('/',authMiddleWare,  getAll(Variant, 'Variant'));
router.get('/:type',authMiddleWare,  getAll(Variant, 'Variant'));
router.get('/:id',authMiddleWare,  getOne(Variant, 'Variant'));
router.patch('/:id',authMiddleWare,  patchRequest(Variant, 'Variant'));
router.delete('/:id',authMiddleWare,  deleteRequest(Variant, 'Variant'));

export default router;