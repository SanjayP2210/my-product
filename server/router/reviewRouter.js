import express from 'express';
const router = express.Router();
import {
    createReview,
    updateReview,
    getReviewById,
    getReviews,
    deleteReview,
    getProductReview,
    getReviewsForAdmin,
    deactivateReview
} from '../controller/reviewController.js';
import authMiddleWare from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/admin-middleware.js';

// Create a new review
router.post('/', authMiddleWare ,createReview);

// get Product review
router.get('/product/:productId', getProductReview);

// get Product review for admin
router.get('/admin/product/:productId',authMiddleWare,adminMiddleware, getReviewsForAdmin);

// Delete a review by ID
router.delete('/admin/:id', authMiddleWare ,adminMiddleware, deactivateReview);

// Get all reviews
router.get('/', authMiddleWare , getReviews);

// Get a single review by ID
router.get('/:id', authMiddleWare , getReviewById);

// Update a review by ID
router.put('/:id', authMiddleWare , updateReview);

// Delete a review by ID
router.delete('/:id', authMiddleWare , deleteReview);

export default router;
