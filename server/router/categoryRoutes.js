import express from 'express';
import { postRequest, getAll, patchRequest, putRequest, deleteRequest, getOne } from '../controller/commonController.js';
import Category from '../models/Category.js';
const router = express.Router();

router.post('/', postRequest(Category, 'Category'));
router.get('/', getAll(Category, 'Category'));
router.get('/:type', getAll(Category, 'Category'));
router.get('/:id', getOne(Category, 'Category'));
router.patch('/:id', patchRequest(Category, 'Category'));
router.delete('/:id', deleteRequest(Category, 'Category'));
export default router;
