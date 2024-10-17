import express from 'express';

import { postRequest, getAll, patchRequest, putRequest, deleteRequest, getOne } from '../controller/commonController.js';
import Tag from '../models/Tag.js';
const router = express.Router();

router.post('/', postRequest(Tag, 'Tag'));
router.get('/', getAll(Tag, 'Tag'));
router.get('/:type', getAll(Tag, 'Tag'));
router.get('/:id', getOne(Tag, 'Tag'));
router.patch('/:id', patchRequest(Tag, 'Tag'));
router.delete('/:id', deleteRequest(Tag, 'Tag'));

export default router;