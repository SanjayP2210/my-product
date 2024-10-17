import express from 'express';
const router = express.Router();
// Bring in Models & Helpers
import Review from '../models/review.js';
import Product from '../models/Product.js';
import mongoose, { isValidObjectId } from 'mongoose';
import { Schema } from 'mongoose';

const createReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const product = await Product.findById(productId);
        let productReviews = await Review.find({ product: productId });
        const userId = req?.user?.id;
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newReview = new Review({
            user: userId,
            product: productId,
            name: req?.user?.name,
            rating: Number(rating),
            comment,
            approved: true,
            createdBy: userId,
            modifiedBy: userId,
        });

        const isReviewed = await productReviews.filter((rev) => {
            if (rev.user?.toString() === userId?.toString()) {
                return rev._id;
            }
        });

        const review = await newReview.save();
        if (isReviewed?.length > 0) {
            const reviewId = isReviewed[0]['_id'];
            const updatedReviewsId = product.reviews?.filter(rev => rev?.toString() != reviewId.toString());
            const deletedReview = await Review.deleteOne({ _id: reviewId.toString() });
            updatedReviewsId.push(review?._id);
            product.reviews = updatedReviewsId;
            productReviews = productReviews?.filter(rev => rev?._id?.toString() != reviewId.toString());
        } else {
            product.reviews.push(review?._id);
            product.numOfReviews = product.reviews.length;
        }
        productReviews.push(review);
        let avg = 0;

        product.numOfReviews = productReviews.length;
        productReviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = parseFloat(avg / productReviews.length)?.toFixed(2);
        const response = await product.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            message: `Your review has been added successfully and will appear when approved!`,
            newReview,
            isError:false
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Error while adding review'
        });
    }
}

// GET all reviews for a product
const getProductReview = async (req, res) => {
    try {
        if(!isValidObjectId(req.params.productId)){
            return res.status(400).json({ message: 'Product ID not valid. Please enter valid Product ID', isError: true });
        }
        const productId = new mongoose.Types.ObjectId(req.params.productId);
        const reviews = await Review.aggregate([
            {
                $match: { product: productId, approved:true }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 1,
                    comment: 1,
                    rating: 1,
                    createdAt:1,
                    createdBy:1,
                    modifiedBy:1,
                    modifiedAt:1,
                    productDetails:{
                        numOfReviews:1,
                        ratings: 1,
                        _id: 1
                    },
                    userDetails: {
                        image: 1,
                        name: 1,
                        _id : 1
                    }
                }
            }
        ]);
        res.status(200).json({
            reviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// fetch all reviews api
const getReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find()
            .sort('-created')
            .populate({
                path: 'user',
                select: 'firstName'
            })
            .populate({
                path: 'product',
                select: 'name slug imageUrl'
            })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Review.countDocuments();

        res.status(200).json({
            reviews,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            count
        });
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
}

router.get('/:slug', async (req, res) => {
    try {
        const productDoc = await Product.findOne({ slug: req.params.slug });
        const status = req.body.status;
        const hasNoBrand =
            productDoc?.brand === null || productDoc?.brand?.isActive === false;

        if (!productDoc || hasNoBrand) {
            return res.status(404).json({
                message: 'No product found.'
            });
        }

        const reviews = await Review.find({
            product: productDoc._id,
            status
        })
            .populate({
                path: 'user',
                select: 'firstName'
            })
            .sort('-created');

        res.status(200).json({
            reviews
        });
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});

const getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const update = req.body;
        const query = { _id: reviewId };

        await Review.findOneAndUpdate(query, update, {
            new: true
        });

        res.status(200).json({
            success: true,
            message: 'review has been updated successfully!'
        });
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
};

// approve review
const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const status = req.body.status;

        const query = { _id: reviewId };
        const update = {
            status,
            isActive: true
        };

        await Review.findOneAndUpdate(query, update, {
            new: true
        });

        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const productId = req?.body?.productId;
        let productReviews = await Review.find({ product: productId });
        const product = await Product.findById(productId);
        product.reviews = product.reviews.filter(rev => rev?.toString() != reviewId?.toString());
        productReviews = productReviews?.filter(rev => rev?._id?.toString() != reviewId.toString());
        let avg = 0;

        productReviews.forEach((rev) => {
            avg += rev.rating;
        });
        const deletedReview = await Review.deleteOne({ _id: reviewId });
        product.ratings = productReviews.length === 0 ? 0 : parseFloat(avg / productReviews.length)?.toFixed(2);
        product.numOfReviews = productReviews.length;
        const response = await product.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            message: `review has been deleted successfully!`,
            review: deletedReview
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
};

const deactivateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const productId = req?.body?.productId;
        const approved = req?.body?.approved;
        let productReviews = await Review.find({ product: productId });
        const product = await Product.findById(productId);
        product.reviews = product.reviews.filter(rev => rev?.toString() != reviewId?.toString());
        productReviews = productReviews?.filter(rev => rev?._id?.toString() != reviewId.toString());
        let avg = 0;

        productReviews.forEach((rev) => {
            avg += rev.rating;
        });
        const deletedReview = await Review.findOneAndUpdate({ _id: reviewId }, { approved }, {
            new: true
        });
        product.ratings = productReviews.length === 0 ? 0 : parseFloat(avg / productReviews.length)?.toFixed(2);
        product.numOfReviews = productReviews.length;
        const response = await product.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            message: `review has been deleted successfully!`,
            review: deletedReview
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
};

const getReviewsForAdmin =  async (req, res) => {
    try {
        if(!isValidObjectId(req.params.productId)){
            return res.status(400).json({ message: 'Product ID not valid. Please enter valid Product ID', isError: true });
        }
        const productId = new mongoose.Types.ObjectId(req.params.productId);
        const reviews = await Review.aggregate([
            {
                $match: { product: productId }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 1,
                    comment: 1,
                    rating: 1,
                    createdAt:1,
                    createdBy:1,
                    modifiedBy:1,
                    modifiedAt:1,
                    approved:1,
                    productDetails:{
                        numOfReviews:1,
                        ratings: 1,
                        _id: 1
                    },
                    userDetails: {
                        image: 1,
                        name: 1,
                        _id : 1
                    }
                }
            }
        ]);
        res.status(200).json({
            reviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {
    createReview,
    updateReview,
    getReviewById,
    getReviews,
    deleteReview,
    getProductReview,
    getReviewsForAdmin,
    deactivateReview
}
