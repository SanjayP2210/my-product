import express from 'express';

import { postRequest, getAll, patchRequest, putRequest, deleteRequest, getOne } from '../controller/commonController.js';
import Gender from '../models/Gender.js';
const router = express.Router();

router.post('/', postRequest(Gender, 'Gender'));
router.get('/', getAll(Gender, 'Gender'));
router.get('/:type', getAll(Gender, 'Gender'));
router.get('/:id', getOne(Gender, 'Gender'));
router.patch('/:id', patchRequest(Gender, 'Gender'));
router.delete('/:id', deleteRequest(Gender, 'Gender'));

export default router;