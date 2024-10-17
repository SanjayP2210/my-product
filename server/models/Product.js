import moment from "moment-timezone";
import { Schema, model } from "mongoose";


const productSchema = new Schema({
    productName: { type: String, required: true },
    taxClass: { type: String },
    vatAmount: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    gender: [{ type: Schema.Types.ObjectId, ref: 'Gender' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    variants: [{
        value: { type: String },
        label: { type: Schema.Types.ObjectId, ref: 'Variant' }
    }],
    description: { type: String, required: true },
    status: { type: String, default: "In Stock" },
    template: { value: String, label: String },
    thumbnail: [{
        public_id: String,
        url: String
    }],
    images: [{
        public_id: String,
        url: String
    }],
    stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    numOfReviews: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    colors: [{
        type: String,
        required: true,
        enum: [
            "#0000ff",
            "#008000",
            "#ff0000",
            "#ffc0cb",
            "#ffff00",
            "#ffd700",
            "#000000",
            "#ffffff",
        ],
    }],
    basePrice: { type: Number, required: true },
    discountType: { type: String, enum: ['no_discount', 'percentage', 'fixed_price'], required: true },
    discountValue: { type: Number, required: true },
    updatedPrice: { type: Number },
    createdAt: {
        type: Date,
        default: moment().tz('Asia/Kolkata').format()
    },
    createdBy: {
        type: Schema.Types.ObjectId
    },
    modifiedBy: {
        type: Schema.Types.ObjectId
    },
    modifiedAt: {
        type: Date,
        default: moment().tz('Asia/Kolkata').format()
    },
});

/**
 * Calculate updated price based on discount type and value
 * 
 * @param {number} originalPrice - The original price of the product
 * @param {string} discountType - The type of discount ('percentage' or 'fixed')
 * @param {number} discountValue - The value of the discount
 * @returns {number} - The updated price after applying the discount
 */
const calculateDiscountedPrice = (originalPrice, discountType, discountValue) => {
    if (discountType === 'percentage') {
        const discountAmount = (originalPrice * discountValue) / 100;
        return originalPrice - discountAmount;
    } else if (discountType === 'fixed_price') {
        return originalPrice - discountValue;
    } else {
        return originalPrice;
    }
};


productSchema.methods.applyDiscount = function () {
    try {
        this.updatedPrice = calculateDiscountedPrice(this.basePrice, this.discountType, this.discountValue);
    } catch (error) {
        console.log('error calculating', error);
    }
};

const Product = model('Product', productSchema);
export default Product;
