import moment from 'moment-timezone';
import Product from '../models/Product.js';
import nodeCahe from 'node-cache';
import Category from '../models/Category.js';
import Gender from '../models/Category.js';
import { deleteImage, uploadImages } from './commonController.js';
import mongoose from 'mongoose';
const myCache = new nodeCahe();
// Create a new product
const addProduct = async (req, res) => {
    try {
        // sample Data
        // const productData = {
        //     productName: 'Example Product',
        //     taxClass: 'Standard',
        //     vatAmount: '15%',
        //     categories: ['60d5ec49e7c4b929384d4e6b'],
        //     gender: ['60d5ec49e7c4b929384d4e6c'],
        //     tags: ['60d5ec49e7c4b929384d4e6d'],
        //     variants: [{ value: 'Red', label: '60d5ec49e7c4b929384d4e6e' }],
        //     description: 'This is an example product',
        //     status: ['60d5ec49e7c4b929384d4e6f'],
        //     template: { value: 'Template1', label: 'Template Label' },
        //     thumbnail: [{ public_id: 'thumb1', url: 'http://example.com/thumb1.jpg' }],
        //     images: [{ public_id: 'img1', url: 'http://example.com/img1.jpg' }],
        //     discountType: 'percentage',
        //     discountValue: 10,
        //     basePrice: 1000,
        // };
        let files = req.files;
        let body = req.body;
        const imageAray = Array.isArray(files?.images) ? files?.images : [files?.images];
        const thumbnailAray = Array.isArray(files?.thumbnail) ? files?.thumbnail : [files?.thumbnail];
        let images ,thumbnail;
        if (files?.newImages) {
            const imageAray = Array.isArray(files?.newImages) ? files?.newImages : [files?.newImages];
            const newImages = await uploadImages(req, res, imageAray,'products');
            images = newImages;
        }
        if (files?.newThumbnail) {
            const thumbnailAray = Array.isArray(files?.newThumbnail) ? files?.newThumbnail : [files?.newThumbnail];
            const newThumbnail = await uploadImages(req, res, thumbnailAray,'products');
            thumbnail = newThumbnail;
        }
        const tags = JSON.parse(body?.tags) || {};
        const variants = JSON.parse(body?.variants) || {};
        const gender = JSON.parse(body?.gender) || {};
        // const thumbnail = JSON.parse(body?.thumbnail) || {};
        // const images = JSON.parse(body?.images) || {};
        const categories = JSON.parse(body?.categories || '{}') || {};

        // const product = new Product({
        //     ...productData,
        //     categories: await Category.find({ _id: { $in: productData.categoryIds } }),
        //     gender: await Gender.find({ _id: { $in: productData.genderIds } }),
        //     tags: await Tag.find({ _id: { $in: productData.tagIds } }),
        //     variants: await Variant.find({ _id: { $in: productData.variantIds } }),
        //     thumbnail: await Media.find({ _id: { $in: productData.thumbnailIds } }),
        //     images: await Media.find({ _id: { $in: productData.imageIds } }),
        //     reviews: await Review.find({ _id: { $in: productData.reviewIds } }),
        // });

        body = {
            ...body,
            tags,
            variants,
            thumbnail,
            images,
            categories,
            gender,
            createdAt: moment().tz('Asia/Kolkata').format(),
            createdBy: req?.user?._id?.toString() || "66715d2df7321f79928501dd",
            modifiedAt: moment().tz('Asia/Kolkata').format(),
            modifiedBy: req?.user?._id?.toString() || "66715d2df7321f79928501dd"
        };
        const product = await new Product(body);
        product.applyDiscount();
        const newProduct = await product.save();
        const cacheProduct = myCache.get("products") ? JSON.parse(myCache.get("products")) : null;
        if (cacheProduct) {
            myCache.delete("products");
        }
        console.log('cache product deleted');
        res.status(201).json({
            message: "Product saved successfully",
            Product: newProduct,
        });
    } catch (err) {
        console.log('error addProduct', err);
        res.status(400).json({ message: err.message, isError: true });
    }
}

const filterByCategory = async (req, res) => {
    const categoryValue = req.params.value;
    try {
        const products = await Product.aggregate([
            { $match: { 'categories.value': categoryValue } },
            {
                $project: {
                    productName: 1,
                    updatedPrice: 1,
                    _id: 1,
                    modifiedAt: 1,
                    createdAt: 1,
                    image: {
                        $map: {
                            input: '$thumbnail',
                            as: 'image',
                            in: '$$image.url'
                        }
                    },
                    ratings: 1
                }
            }
        ]);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const categoryLookUpQuery = (category) => {
    const basicQuery = {
        $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories'
        }
    }
    if (category) {
        return [
            {
                ...basicQuery
            },
            {
                $unwind: {
                    path: '$categories',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $match: {
                    ...(category && { 'categories.name': category })
                }
            }];
    }
    return basicQuery;
}

const genderLookUpQuery = (gender) => {
    const basicQuery = [
        {
            $lookup: {
                from: 'genders',
                localField: 'gender',
                foreignField: '_id',
                as: 'gender'
            }
        },
        {
            $unwind: {
                path: '$gender',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                ...(gender && { 'gender.name': gender })
            }
        },
    ];
    return basicQuery;

}

const colorLookUpQuery = (variant) => {
    const basicQuery = [
        {
            '$unwind': '$variants'
        },
        // Stage 2: Lookup to get variant details
        {
            '$lookup': {
                'from': 'variants',  // Name of the variants collection
                'localField': 'variants.label',  // Field in the products collection
                'foreignField': '_id',  // Field in the variants collection
                'as': 'variantDetails'
            }
        },
        // Stage 3: Unwind the variantDetails array
        {
            '$unwind': '$variantDetails'
        },
        // Stage 4: Match products based on variant name and value
        {
            '$match': {
                'variantDetails.name': 'color',  // Filter by variant name (e.g., 'color')
                'variants.value': variant  // Filter by variant value from query parameter
            }
        },
    ];
    return basicQuery;

}

const statusLookUpQuery = () => {
    return {
            $lookup: {
                from: 'status',
                localField:'status',
                foreignField: '_id',
                as:'status'
            }
        }
}

export const getVariantsByFilter = async (req, res, next) => {
    try {
        const variantValue = req?.params?.variant || '';
        const response = await Product.aggregate([
            // Stage 1: Unwind the variants array
            {
                '$unwind': '$variants'
            },
            // Stage 2: Lookup to get variant details
            {
                '$lookup': {
                    'from': 'variants',  // Name of the variants collection
                    'localField': 'variants.label',  // Field in the products collection
                    'foreignField': '_id',  // Field in the variants collection
                    'as': 'variantDetails'
                }
            },
            // Stage 3: Unwind the variantDetails array
            {
                '$unwind': '$variantDetails'
            },
            // Stage 4: Match products based on variant name and value
            {
                '$match': {
                    'variantDetails.name': 'color',  // Filter by variant name (e.g., 'color')
                    'variants.value': variantValue  // Filter by variant value from query parameter
                }
            },
            // Stage 5: Project necessary fields
            {
                '$project': {
                    'productName': 1,
                    'basePrice': 1,
                    '_id': 1,
                    'variants': 1, // Include the variants in the projection
                    variantDetails:1 
                }
            }
        ]);
    res.json({
        response,
        message: 'Variants fetched successfully'
    });
} catch (error) {
    console.log("err in getVariantsByFilter for shop", err);
    res.status(500).json({ message: err.message, isError: true });
}
}

const getMaxPriceOfProduct = async (req, res) => {
    try {
        const product = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    maxPrice: { $max: "$updatedPrice" }
                }
            }
        ]);
        res.json({
            maximumPrice: product[0]?.maxPrice || 1,
            message: 'Maximum price get successfully'
        });
    } catch (err) {
        console.log('error getMaxPriceOfProduct', err);
        res.status(500).json({ message: err.message, isError: true });
    }
}

const getProductForShop = async (req, res) => {
    try {
        const { page = 1, limit = 50, search = '', sortBy = 'productName', sortOrder = 'asc', category = '', minPrice, maxPrice, gender = '', color = '' } = req.query;

        let matchStage = {
            $match: {},
        };
        let basicQuery = [];
        if (category) {
            const categoryQuery = categoryLookUpQuery(category);
            basicQuery = [...basicQuery, ...categoryQuery];
        }

        if (gender) {
            const genderQuery = genderLookUpQuery(gender);
            basicQuery = [...basicQuery, ...genderQuery];
        }

        // if (color) {
        //     const colorQuery = colorLookUpQuery(color);
        //     basicQuery = [...basicQuery, ...colorQuery];
        // }

        const query = {
            ...(search ? { productName: { $regex: search, $options: 'i' } } : {}),
            ...(minPrice != null && maxPrice != null ? { updatedPrice: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) } } : {}),
            ...(color ? { colors: { $in: [color] }} : {}),
        };

        if (Object.keys(query).length > 0) {
            matchStage.$match = { ...matchStage.$match, ...query };
            basicQuery = [...basicQuery, matchStage];
        }


        const sortQuery = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const baseQuery = [
            ...basicQuery,
            {
                $project: {
                    productName: 1,
                    basePrice: 1,
                    _id: 1,
                    stock: 1,
                    updatedPrice: 1,
                    image: {
                        $arrayElemAt: ['$thumbnail.url', 0]
                    },
                    ratings: 1,
                    categories: {
                        name: 1 // Select specific fields from the populated 'books' documents if needed
                    },
                }
            }
        ]
        console.log('baseQuery', baseQuery);

        const products = await Product.aggregate(baseQuery).sort(sortQuery)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        console.log("err in getProduct for shop", err);
        res.status(500).json({ message: err.message, isError: true });
    }
}

// Get all products
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 50, search = '', sortBy = 'productName', sortOrder = 'asc' } = req.query;
        const matchStage = {};
        const query = {
            ...(search ? { productName: { $regex: search, $options: 'i' } } : {}),
        };

        matchStage.$match = Object.keys(query).length > 0 ? { ...query } : {};
        let products = [];
        const sortQuery = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        let basicQuery = [];
        const categoryQuery = categoryLookUpQuery();
        basicQuery = [...basicQuery, categoryQuery];
        // const statusQuery = statusLookUpQuery();
        // basicQuery = [...basicQuery, statusQuery];
        const skip = (parseInt(page) - 1) * parseInt(limit);
        if (Object.keys(query).length > 0) {
            matchStage.$match = { ...matchStage.$match, ...query };
            basicQuery = [...basicQuery, matchStage];
        }
        const baseQuery = [
            ...basicQuery,
            {
                '$sort': sortQuery
            },
            {
                '$skip': skip
            },
            {
                '$limit': (parseInt(limit) * 1)
            },
            {
                $project: {
                    productName: 1,
                    basePrice: 1,
                    updatedPrice: 1,
                    _id: 1,
                    createdAt: 1,
                    description: 1,
                    stock: 1,
                    status: 1,
                    image: {
                        $map: {
                            input: '$thumbnail',
                            as: 'image',
                            in: '$$image.url'
                        }
                    },
                    categories: {
                        name: 1 // Select specific fields from the populated 'books' documents if needed
                    },
                    ratings: 1
                }
            },
        ]
        products = await Product.aggregate(baseQuery);

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count,
        });
    } catch (err) {
        console.log("err in getProduct", err);
        res.status(500).json({ message: err.message, isError: true });
    }
}

// Get a single product for edit
const getProductForEditById = async (req, res) => {
    try {
        console.log("req.params.productId", req.params.productId);
        const data = await Product.findById(req.params.productId)
            .populate({ path: 'categories', select: 'name' })
            .populate({ path: 'gender', select: 'name' })
            .populate({ path: 'tags', select: 'name' })
            .populate({ path: 'variants', select: 'name' })
            .populate('thumbnail')
            .populate('images')
            .populate('reviews')
            .exec();
        // console.log("data", data);
        res.json({ productData: data });
    } catch (err) {
        console.log("err in getProductById", err);
    }
}

// Get a single product
const getProductById = async (req, res) => {
    try {
        console.log("req.params.productId", req.params.productId);
        const productId = new mongoose.Types.ObjectId(req.params.productId);
        const data = await Product.aggregate([
            {
                $match: {
                    _id: productId,
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categories",
                    foreignField: "_id",
                    as: "categories",
                },
            },
            {
                '$unwind': '$variants'
            },
            {
                '$lookup': {
                    'from': 'variants',  // Name of the variants collection
                    'localField': 'variants.label',  // Field in the products collection
                    'foreignField': '_id',  // Field in the variants collection
                    'as': 'variantDetails'
                }
            },
            {
                $project: {
                    productName: 1,
                    basePrice: 1,
                    updatedPrice: 1,
                    _id: 1,
                    createdAt: 1,
                    description: 1,
                    stock: 1,
                    ratings: 1,
                    status: 1,
                    thumbnail: 1,
                    images: 1,
                    categories: {
                        $reduce: {
                            input: {
                                $map: {
                                    input: "$categories",
                                    as: "category",
                                    in: "$$category.name",
                                },
                            },
                            initialValue: "",
                            in: {
                                $cond: {
                                    if: { $eq: ["$$value", ""] },
                                    then: "$$this",
                                    else: { $concat: ["$$value", ", ", "$$this"] },
                                },
                            },
                        },
                    },
                    colors: 1,
                    variants: 1,
                    numOfReviews: 1
                },
            }
        ]);

        if (data && data?.length > 0) {
            res.json({ productData: data[0], isError: false });
        } else {
            res.json({ productData: [], message: 'Product Not Found With Given ID', isError: true });
        }


    } catch (err) {
        console.log("err in getProductById", err);
    }
}

// Update a product
const updateProduct = async (req, res) => {
    try {
        let files = req.files;
        const id = req.params.productId;
        let body = req.body;
        let images = JSON.parse(body?.images) || {};
        let thumbnail = JSON.parse(body?.thumbnail) || {};
        if (files?.newImages) {
            const imageAray = Array.isArray(files?.newImages) ? files?.newImages : [files?.newImages];
            const newImages = await uploadImages(req, res, imageAray,'products');
            images = [
                ...images,
                ...newImages
            ];
        }
        if (files?.newThumbnail) {
            const thumbnailAray = Array.isArray(files?.newThumbnail) ? files?.newThumbnail : [files?.newThumbnail];
            const newThumbnail = await uploadImages(req, res, thumbnailAray,'products');
            thumbnail = [
                ...thumbnail,
                ...newThumbnail
            ];
        }
        if (body?.deletedImages) {
            const deletedImages = JSON.parse(body?.deletedImages) || {};
            if (deletedImages && deletedImages?.length > 0) {
                deletedImages.forEach(async (element) => {
                    const deleteImages = await deleteImage(element?.public_id);
                });
            }
        }
        if (body?.deletedThumbnail) {
            const deletedThumbnail = JSON.parse(body?.deletedThumbnail) || {};
            if (deletedThumbnail && deletedThumbnail?.length > 0) {
                deletedThumbnail.forEach(async (element) => {
                    const deleteImages = await deleteImage(element?.public_id);
                });
            }
        }
        const colors = JSON.parse(body?.colors) || [];
        const tags = JSON.parse(body?.tags) || {};
        const variants = JSON.parse(body?.variants) || {};
        const gender = JSON.parse(body?.gender) || {};
        const categories = JSON.parse(body?.categories || '{}') || {};
        body = {
            ...body,
            tags,
            variants,
            thumbnail,
            images,
            categories,
            gender,
            colors,
            modifiedAt: moment().tz('Asia/Kolkata').format(),
            modifiedBy: req?.user?._id?.toString()
        };
        const product = await new Product(body);
        product.applyDiscount();
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        const cacheProduct = myCache.get("products") ? JSON.parse(myCache.get("products")) : null;
        if (cacheProduct) {
            myCache.delete("products");
        }
        console.log('cache product deleted');
        res.json({ message: 'Product Updated Successfully', product: updatedProduct });
    } catch (err) {
        console.log('error updateProduct', err);
        res.status(400).json({ message: err.message, isError: true });
    }
}

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.productId;
        const product = await Product.findById(id);
        
        await Product.deleteOne({ _id: id });
        if(product?.images?.length > 0){
            product.images.forEach(async (image) => {
                await deleteImage(image?.public_id);
            });
        }
        if(product?.thumbnail?.length > 0){
            product.thumbnail.forEach(async (image) => {
                await deleteImage(image?.public_id);
            });
        }

        const cacheProduct = myCache.get("products") ? JSON.parse(myCache.get("products")) : null;
        if (cacheProduct) {
            myCache.delete("products");
        }
        res.json({ message: 'Deleted Product', product });
    } catch (err) {
        console.log('error delete Product', err);
        res.status(400).json({ message: err.message, isError: true });
    }
}

// Create New Review or Update the review
const createProductReview = async (req, res) => {
    try {
        const { rating, comment, productId, userId } = req.body;

        const review = {
            user: userId,
            productId,
            name: req?.user?.name || 'sanjay',
            rating: Number(rating),
            comment,
        };
        // const userId = "66715d2df7321f79928501dd";

        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find(
            (rev) => rev?.user?.toString() === (req?.user?._id?.toString() || userId)
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev?.user?.toString() === (req?.user?._id?.toString() || userId))
                    (rev.rating = rating), (rev.comment = comment), (rev.modifiedAt = moment().tz('Asia/Kolkata').format());
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        const response = await product.save({ validateBeforeSave: false });
        if (response) {
            res.status(200).json({
                success: true,
                message: "Review saved successfully",
            });
        }
    } catch (error) {
        console.log('error create review Product', error);
        res.status(400).json({ message: err.message, isError: true });
    }
}

// Get All Reviews of a product
const getProductReviews = async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return res.status(400).json({ message: "Product not found", isError: true })
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
        numOfReviews: product.numOfReviews,
        ratings: product.ratings,
    });
}

// Delete Review
const deleteReview = async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return res.status(400).json({ message: "Product not found", isError: true })
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.productId.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
}

const getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate('categories tags');
        if (!product) return res.status(404).send('Product not found');

        const relatedProducts = await Product.aggregate([
            {
                $match: {
                    _id: { $ne: product._id }, // Exclude the current product
                    $or: [
                        { categories: { $in: product.categories } },
                        { tags: { $in: product.tags } }
                    ]
                }
            },
            {
                $project: {
                    productName: 1,
                    basePrice: 1,
                    updatedPrice: 1,
                    _id: 1,
                    createdAt: 1,
                    description: 1,
                    stock: 1,
                    status: 1,
                    image: {
                        $map: {
                            input: '$thumbnail',
                            as: 'image',
                            in: '$$image.url'
                        }
                    },
                    categories: {
                        name: 1 // Select specific fields from the populated 'books' documents if needed
                    },
                    ratings: 1
                }
            }]).limit(10);


        res.json({
            isError:false,
            relatedProducts,
            message : 'Related Products Fetched Successfully'
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Admin Routes

// Get All Product (Admin)
const getAdminProducts = async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  };
  


export {
    deleteProduct,
    addProduct,
    updateProduct,
    getProductById,
    getProducts,
    createProductReview,
    getProductReviews,
    deleteReview,
    filterByCategory,
    getProductForShop,
    getRelatedProducts,
    getMaxPriceOfProduct,
    getProductForEditById,
    getAdminProducts
}