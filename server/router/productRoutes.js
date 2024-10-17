import express from 'express';
import { addProduct, updateProduct, deleteProduct, getProductById, getProducts, createProductReview, deleteReview, getProductReviews, filterByCategory, getProductForShop, getRelatedProducts, getMaxPriceOfProduct, getVariantsByFilter, getProductForEditById, getAdminProducts } from '../controller/productController.js';
import Product from '../models/Product.js';
import authMiddleWare from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/admin-middleware.js';
const router = express.Router();

router.get('/', authMiddleWare , getProducts)
router.post('/', authMiddleWare , addProduct);
router.get('/shop' , getProductForShop);
router.get('/max-price', getMaxPriceOfProduct);
router.get('/get-variant/:variant', getVariantsByFilter);
router.put('/review', authMiddleWare , createProductReview);
router.get('/review/:productId', getProductReviews);
router.delete('/review', authMiddleWare , deleteReview);
router.get('/category/:value', filterByCategory);
router.get('/related/:productId', getRelatedProducts);
router.get('/product-for-edit/:productId', authMiddleWare, getProductForEditById);
router.get('/get-single-product/:productId', getProductById);
router.put('/:productId', authMiddleWare , getProduct, updateProduct);
router.delete('/:productId', authMiddleWare , getProduct, deleteProduct);
router.get('/admin', authMiddleWare,adminMiddleware , getAdminProducts)
async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.productId);
        if (product == null) {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.product = product;
    next();
}



export default router;
