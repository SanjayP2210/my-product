import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiService from '../service/apiService';

export const getCart = createAsyncThunk('cart/getCart', async (params) => {
    return await apiService.getRequest('cart');
});

export const addToCart = createAsyncThunk('cart/addToCart', async (data) => {
    return await apiService.postRequest('cart/add-to-cart', data);
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId) => {
    return await apiService.deleteRequest(`cart/remove-from-cart/${productId}`);
});

export const removeFullProductFromCart = createAsyncThunk('cart/removeFullProductFromCart', async (productId) => {
    return await apiService.deleteRequest(`cart/remove-full-product-from-cart/${productId}`);
});

const initialState = {
    cartItems: [],
    isCartUpdated: false,
    isProductRemoveFromCart: false,
    totalCount: 0,
    totalPrice: 0,
    totalDiscount: 0,
    isLoading: true,
    shippingInfo: {},
    shippingCharges: 0,
    tax: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCartState: (state, action) => {
            state.isCartUpdated = false;
            state.isProductRemoveFromCart = false;
        },
        setShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCart.fulfilled, (state, action) => {
                if (action.payload.isError) return;
                if(!action.payload.cart) return;
                const { items, totalCount, totalPrice, totalDiscount } = action.payload.cart;
                state.shippingCharges = totalPrice > 1000 ? 0 : 200;
                state.tax = totalPrice * 0.18;
                state.cartItems = items;
                state.totalCount = totalCount;
                state.totalPrice = totalPrice;
                state.totalDiscount = totalDiscount;
                console.log('cartItems:', state.cartItems);
                state.isLoading = false;
                state.isCartUpdated = false;
                state.isProductRemoveFromCart = false;
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                if (action.payload.isError) return;
                state.isCartUpdated = true;
                state.isLoading = false;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                if (action.payload.isError) return;
                state.isLoading = false;
                state.isProductRemoveFromCart = true;
            })
            .addCase(removeFullProductFromCart.fulfilled, (state, action) => {
                if (action.payload.isError) return;
                state.isLoading = false;
                state.isProductRemoveFromCart = true;
                console.log('cartItems:', state.cartItems);
            });
    },
});

export const { resetCartState, setShippingInfo } = cartSlice.actions;
export default cartSlice.reducer;
