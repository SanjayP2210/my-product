import moment from 'moment-timezone';
import Cart from '../models/Cart.js';
import Category from '../models/Category.js';

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id },
            {
                totalPrice: 1,
                totalCount: 1,
                'items.quantity': 1,
                'items.price': 1
            })
            .populate({
                path: 'items.product',
                select: '_id updatedPrice thumbnail stock productName basePrice categories',
                populate: { path: 'categories' }
            });
        if (cart) {
            cart = cart.toObject();
            console.log('cart', cart.items);
            cart.items = cart.items.map(item => ({
                ...item.product,
                productId: item?.product?._id,
                quantity: item?.quantity,
                price: item?.product?.updatedPrice,
                image: item?.product?.thumbnail[0]?.url,
                basePrice: item?.product?.basePrice,
                discountedPrice: parseFloat((item?.product?.basePrice - item?.product?.updatedPrice) * item?.quantity),
                categories: item?.product?.categories?.map(({ name }) => name),
            }));
            cart.totalDiscount = cart.items.reduce((accumulator, item) => {
                return accumulator += item?.discountedPrice;
            }, 0);
            cart.totalPrice = cart.items.reduce((accumulator, item) => {
                return accumulator += (item?.price * item?.quantity)
            }, 0);
            cart.totalCount = cart.items?.length;
        }
        console.log('totalCount', cart);
        res.json({
            isError: false,
            message: 'Cart fetched successfully',
            cart
        });
    } catch (error) {
        res.status(404).send({ message: 'error while getting cart', isError: true });
        console.log('error while getting cart', error);
    }
};

export const addToCart = async (req, res) => {
try {
    const { productId, quantity, price,...rest } = req.body;
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId },
        {
            totalPrice: 1,
            totalCount: 1,
            'items.quantity': 1,
            'items.price': 1
        })
        .populate({
            path: 'items.product',
            select: '_id updatedPrice thumbnail stock productName basePrice'
        });
    let updatedQuantity = quantity;
    if (cart) {
        const existingProductIndex = cart.items.findIndex(item => item.product?._id.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.items[existingProductIndex].quantity += quantity;
            updatedQuantity = cart.items[existingProductIndex].quantity;
        } else {
            cart.items.push({ product: productId, quantity, price });
        }
    } else {
        cart = new Cart({
            user: userId,
            items: [{ product: productId, quantity, price}],
            createdBy: userId,
            modifiedBy: userId,
            createdAt: moment().tz('Asia/Kolkata').format(),
            modifiedAt: moment().tz('Asia/Kolkata').format(),
        });
    }
    cart.totalDiscount = cart.items.reduce((total, item) => {
        return total += parseFloat((item?.product?.basePrice - item?.product?.updatedPrice) * item?.quantity);
    }, 0);
    cart.totalCount = cart?.items?.length;
    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item?.product?.updatedPrice * item.quantity);
    }, 0);
    cart.modifiedBy = userId;
    cart.modifiedAt = moment().tz('Asia/Kolkata').format();
    await cart.save();
    let item = {
        _id: productId,
        productId,
        quantity: updatedQuantity,
        price,
        ...rest
    };

    res.status(200).json({
        message: 'Item added to cart!',
        isError: false,
        cart: {
            item,
            totalCount: cart?.totalCount,
            totalPrice: cart?.totalPrice,
            totalDiscount: cart?.totalDiscount,
        },
        productId,
    });
} catch (error) {
    res.status(404).send({ message: 'error while creating new cart',isError: true });
    console.log('error while creating new cart', error);
}
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id },
            {
                totalPrice: 1,
                totalCount: 1,
                'items.quantity': 1,
                'items.price': 1
            })
            .populate({
                path: 'items.product',
                select: '_id updatedPrice thumbnail stock productName basePrice'
            });

        if (cart) {
            const existingProductIndex = cart.items.findIndex((item) => item.product?._id?.toString() === productId);

            if (existingProductIndex !== -1) {
                if (cart.items[existingProductIndex].quantity === 1) {
                    cart.items = cart.items.filter((item) => item.product?._id?.toString() !== productId);
                } else {
                    cart.items[existingProductIndex].quantity -= 1;
                }
            }
            await cart.save();
            res.status(200).json({
                message: 'Item removed from cart!',
                isError: false,
                cart: {
                    totalCount: cart.totalCount,
                    totalPrice: cart.totalPrice,
                    totalDiscount: cart?.totalDiscount
                },
                productId,
            });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(404).send({ message: 'error while removing cart', isError: true });
        console.log('error while remove cart', error);
    }
};

export const removeFullProductFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id },
            {
                totalPrice: 1,
                totalCount: 1,
                'items.quantity': 1,
                'items.price': 1
            })
            .populate({
                path: 'items.product',
                select: '_id updatedPrice thumbnail stock productName basePrice'
            });

        if (cart) {

            const existingProductIndex = cart.items.findIndex((item) => item.product?._id?.toString() === productId);

            if (existingProductIndex !== -1) {
                cart.items = cart.items.filter((item) => item.product?._id?.toString() !== productId);
            }
            await cart.save();
            res.status(200).json({
                message: 'Item removed from cart!',
                productId,
            });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(404).send({ message: 'error while removing cart', isError: true });
        console.log('error while remove cart', error);
    }
};