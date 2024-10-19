import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiService from '../service/apiService';

// get all Orders -- Admin
export const getAllOrders = createAsyncThunk('order/getAllOrders', async (params) => {
  return await apiService.getRequest(params ? `order/admin-order?${params.toString()}` : 'order/admin-order');
});

// get all Orders -- Admin
export const getMonthlyReport = createAsyncThunk('order/getMonthlyReport', async (params) => {
  return await apiService.getRequest('order/admin-order-report');
});

// get all payments -- Admin
export const getAllPayments = createAsyncThunk('order/getAllPayments', async (params) => {
  return await apiService.getRequest(params ? `order/admin-order/get-all-payments?${params.toString()}` : 'order/admin-order/get-all-payments');
});

// get logged in user  Orders
export const myOrders = createAsyncThunk('order/myOrders', async (params) => {
  return await apiService.getRequest(`order/my-orders?${params.toString()}`);
});

// get single Orders
export const getSingleOrder = createAsyncThunk('order/getSingleOrder', async (orderId) => {
  return await apiService.getRequest(`order/${orderId}`);
});

// Create new Order
export const createOrder = createAsyncThunk('order/new', async (data) => {
  return await apiService.postRequest('order/new', data);
});

// update Order Status -- Admin
export const updateOrder = createAsyncThunk('order/updateOrder', async (orderDetail) => {
  return await apiService.putRequest(`order/admin-order/${orderDetail?.orderId}`, orderDetail);
});

// delete Order -- Admin
export const deleteOrder = createAsyncThunk('order/deleteOrder', async (orderId) => {
  return await apiService.deleteRequest(`order/admin/${orderId}`);
});

const initialState = {
  orders: [],
  orderDetail:{},
  isLoading: false,
  isOrderUpdated: false,
  payments: [],
  generatedOrderId: null,
  chartData:{}
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state, action) => {
      state.isOrderUpdated = false;
      state.orderDetail = {},
      state.isOrderUpdated = false;
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(myOrders.fulfilled, (state, action) => {
        if (action.payload.isError) return;
        console.log('orders:', state.orders);
        state.generatedOrderId = null;
        state.orders = action?.payload?.orders;
        state.isLoading = false;

      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        if (action.payload.isError) return;
        state.orders = action?.payload?.orders;
        state.generatedOrderId = null;
        console.log('orders:', state.orders);
        state.isLoading = false;

      })
      .addCase(getMonthlyReport.fulfilled, (state, action) => {
        if (action.payload.isError) return;
        state.chartData = action?.payload?.chartData;
        console.log('chartData:', state.chartData);
        state.isLoading = false;

      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        if (action.payload.isError) return;
        state.payments = action?.payload?.payments;
        console.log('payments:', state.payments);
        state.isLoading = false;

      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        if (action.payload.isError) return;
        state.orderDetail = action?.payload?.order;
        state.generatedOrderId = null;
        console.log('orders:', state.orders);
        state.isLoading = false;

      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (action.payload.isError) return;
        state.generatedOrderId = action?.payload?.order?._id;
        console.log('state',state)
        state.isOrderUpdated = true;
        state.isLoading = false;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        if (action.payload.isError) return;
        state.isOrderUpdated = true;
        state.isLoading = false;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        if (action.payload.isError) return;
        state.isLoading = false;
      })
  },
});
export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;




