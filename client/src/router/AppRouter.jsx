import { lazy, Suspense, useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Loader from "../components/Loader/Loader.jsx";
import OrderList from "../pages/Ecommerce/Order/OrderList.jsx";
import MainLayout from "../components/Layout/MainLayout.jsx";
import AuthRoute from "./AuthRoute.jsx";
import OrderDetails from "../pages/Ecommerce/Order/OrderDetails.jsx";
import AdminRoute from "./AdminRoute.jsx";
import UserList from "../pages/User/UserList.jsx";
import { useSelector } from "react-redux";
import ReviewList from "../pages/Ecommerce/Review/ReviewList.jsx";
import PaymentHistory from "../pages/Admin/PaymentHistory.jsx";
import PaymentList from "../pages/Admin/PaymentList.jsx";
// const ComponentA = lazy(() => import("./ComponentA"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard"));
const UserProfile = lazy(() => import("../pages/profile/UserProfile"));
const ForgetPassword = lazy(() => import("../pages/Auth/ForgetPassword.jsx"));
const ResetPassword = lazy(() => import("../pages/ResetPassword.jsx"));
const Login = lazy(() => import("../pages/Auth/Login.jsx"));
const Logout = lazy(() => import("../pages/Logout.jsx"));
const MasterForm = lazy(() => import("../pages/MasterForm/MasterForm.jsx"));
const PrivateRoute = lazy(() => import("./PrivateRoute.jsx"));
const AddCategory = lazy(() => import("../pages/AddCategory.jsx"));
const Shop = lazy(() => import("../pages/Ecommerce/Shop/Shop.jsx"));
const ProductList = lazy(() =>
  import("../pages/Ecommerce/ProductList/ProductList.jsx")
);
const ProductDetails = lazy(() =>
  import("../pages/Ecommerce/ProductDetails/ProductDetails.jsx")
);
const AddProduct = lazy(() =>
  import("../pages/Ecommerce/Master/AddProduct.jsx")
);
const CheckoutProduct = lazy(() =>
  import("../pages/Ecommerce/Checkout/CheckoutProduct.jsx")
);


const AppRouter = () => {

const {
  isAdmin,
  isLoggedIn,
  loginUserData: user,
} = useSelector((state) => state.auth);
  return (
    <>
      <Suspense fallback={<Loader visible={true} />}>
        <Routes>
          <Route path="/auth" element={<AuthRoute />}>
            <Route path=":pageName" element={<Login />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={(isLoggedIn && isAdmin) ? <Dashboard/>  : <Shop />} />
            <Route
              path="product-detail/:productId"
              element={<ProductDetails />}
            />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="master/category" element={<AddCategory />} />
              <Route path="master/:componentName" element={<MasterForm />} />
              <Route path="my-order" element={<OrderList />} />
              <Route
                path="order-detail/:orderId"
                element={<OrderDetails />}
              />
              <Route path="checkout-product" element={<CheckoutProduct />} />
              <Route path="/admin" element={<AdminRoute />} >
                <Route path="shop" element={<Shop />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="product-list" element={<ProductList />} />
                <Route path="order-list" element={<OrderList />} />
                <Route path="user-list" element={<UserList />} />
                <Route path="review-list" element={<ReviewList />} />
                <Route path="edit-order/:orderId" element={<OrderDetails />} />
                <Route path="edit-product/:id" element={<AddProduct />} />
                <Route path="payment-history" element={<PaymentHistory />} />
                <Route path="payment-list" element={<PaymentList />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
