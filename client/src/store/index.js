import { configureStore } from "@reduxjs/toolkit";
// import rootReducer from "../reducers";
import userReducer from "../reducers/userReducer";
import authReducer from "../reducers/authReducer";
import cartReducer from "../reducers/cartReducer";
import orderReducer from "../reducers/orderReducer";

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer
    }
})

export default store;