import React from 'react'
import { getJWTToken } from '../constants/utilities';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const {
        isAdmin,
      } = useSelector((state) => state.auth);
    const token = getJWTToken();
    if (!token) {
      return <Navigate to="/auth/login" />;
    }else if(!isAdmin){
      return <Navigate to="/" />;
    }

    return <Outlet />
}

export default AdminRoute