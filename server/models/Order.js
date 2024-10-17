import moment from 'moment-timezone';
import mongoose, { model, Schema } from 'mongoose';

const orderSchema = new Schema({
    shippingInfo: {
        street: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        zipCode: {
            type: String
        },
        mobileNumber: {
            type: String,
            max: [10, '10 Characters is allowed'],
            validate: {
                validator: function (v) {
                    return /\d{10}/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            required: [true, 'User phone number required']
        },
    },
    orderItems: [
        {
            cartId: {
                type: mongoose.Schema.ObjectId,
                ref: "Cart",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        typeOfPayment: {
            type: String,
            required: true,
        }
    },
    paidAt: {
        type: Date,
        required: true,
        default : Date.now()
    },
    shippedAt:{
        type: Date,
        required: true,
        default : Date.now()
    },
    cancelledAt:{
        type: Date,
        required: true,
        default : Date.now()
    },
    refundAt: {
        type: Date,
        required: true,
        default : Date.now()
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt: Date,
}, { timestamps: true });


const Order = model('Order', orderSchema);

export default Order;
