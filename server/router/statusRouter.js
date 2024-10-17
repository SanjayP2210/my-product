import express from 'express';

import { postRequest, getAll, patchRequest, putRequest, deleteRequest, getOne } from '../controller/commonController.js';
import Status from '../models/Status.js';
const router = express.Router();

router.post('/', postRequest(Status, 'Status'));
router.get('/', getAll(Status, 'Status'));
router.get('/:type', getAll(Status, 'Status'));
router.get('/:id', getOne(Status, 'Status'));
router.patch('/:id', patchRequest(Status, 'Status'));
router.delete('/:id', deleteRequest(Status, 'Status'));

export default router;