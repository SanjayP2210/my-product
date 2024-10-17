import { Navigate, Outlet } from "react-router-dom";
import { getJWTToken } from "../constants/utilities";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  
  const token = getJWTToken();
  if (!token) {
    return <Navigate to="/auth/login" />;
  }
  return <Outlet />
  // return token ? (
  //   <>
  //     <Navbar />
  //     <div className="page-wrapper" id="main-wrapper">
  //       <div className="body-wrapper">
  //         <div className="body-wrapper-inner">
  //           <div className="container-fluid">
  //             <Outlet />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // ) : (
  //   <Navigate to="/" />
  // );
};

export default PrivateRoute;
