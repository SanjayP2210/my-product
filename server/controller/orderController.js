import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { refundPayment } from "./paymentController.js";

export const newOrder = async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        const body = {
            items: [],
            totalCount: 0,
            totalPrice: 0,
            totalDiscount: 0,
            modifiedBy: req?.user?._id
        }
        await Cart.updateOne({ _id: cart?._id }, { $set: body });
    }

    res.status(201).json({
        success: true,
        order,
    });
};

export const getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    ).populate("orderItems.product", "thumbnail");

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
}

// get logged in user  Orders
export const myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });
}

export const getAllPayments = async(req, res) =>{
    try {
        const orders = await Order.find();
        const payments = orders.map(order => {
            return {
                paymentInfo: order.paymentInfo,
                orderId: order._id,
                paidAt: order.paidAt,
                totalPrice: order.totalPrice,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                orderStatus: order.orderStatus,
                refundAt: order.refundAt,
            }
        });
        res.status(200).json({
            success: true,
            payments,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// get all Orders -- Admin
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();
    
        let totalAmount = 0;
    
        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });
    
        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        });
    } catch (error) {
        console.log('error',error)
    }
}

// update Order Status -- Admin
export const updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHander("You have already delivered this order", 400));
    }

    if (req.body.payment_status !== "succeeded" && req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
        order.shippedAt = Date.now();
    }

    if (req.body.payment_status === "succeeded") {
        order.paymentInfo.status = "succeeded";
        order.paidAt = Date.now();
    }

    if(req.body.status === "Cancelled"){
        if(order.paymentInfo.typeOfPayment === "stripe"){
            const response = await refundPayment(order.paymentInfo.id)
            if(response){
                order.paymentInfo.status = "refunded";
                order.refundAt = Date.now();
            }
        }else{
            order.paymentInfo.status = "refunded";
            order.refundAt = Date.now();
        }
        order.cancelledAt = Date.now();
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    if(product.stock >= 0){
        product.stock -= quantity;
        if (product.stock === 0) {
            product.status = 'Out Of Stock';
        }
    }

    await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
export const deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
    });
}

export const getMonthlyReport= async (req,res)=> {
    try {
        const report = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date('2024-01-01'), $lt: new Date('2025-01-01') },
                    orderStatus: { $ne: 'Cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$createdAt" }
                    },
                    totalSales: { $sum: "$totalPrice" }
                }
            },
            {
                $project: {
                    monthYear: "$_id",
                    totalSales: 1,
                    _id: 0,
                    toatalPrice: 1
                }
            },
            {
                $sort: { monthYear: 1 }
            }
        ]);

        // Prepare data for ApexCharts
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug","Sep", "Oct", "Nov", "Dec"]

        const monthlyIncome = new Array(12).fill(0); // Initialize array for 12 months
        let totalIncome = 0;
        report.forEach(item => {
            const monthIndex = parseInt(item.monthYear.split('-')[1]) - 1; // Get month index (0-11)
            monthlyIncome[monthIndex] = item.totalSales;
            totalIncome += item.totalSales;
        });

        const chartData = {
            categories: months,
            series: [{
                name: "2022",
                data: [50, 60, 30, 55, 75, 60, 100, 120,60, 100, 120],
              },
              {
                name: "2023",
                data: [35, 45, 40, 50, 35, 55, 40, 45,60, 100, 120],
              },{
                name : "2024",
                data: monthlyIncome
            }],
            totalIncome
        };
        res.status(200).json({
            success: true,
            chartData
        });

    } catch (error) {
        console.error("Error fetching monthly report:", error);
    }
}