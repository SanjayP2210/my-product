import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import TotalIncomeLineChart from "./TotalIncomeLineChart";
import AnnualProfitChart from "./AnnualProfitChart";
import YourPerformance from "./YourPerformance";
import CustomerChart from "./CustomerChart";
import SalesOverviewChart from "./SalesOverviewChart";
import RevenueByProduct from "./RevenueByProduct";
import TotalSettlements from "./TotalSettlements";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../reducers/userReducer";
import { getAllOrders, getMonthlyReport } from "../../reducers/orderReducer";
import apiService from "../../service/apiService";
import { Link, NavLink } from "react-router-dom";
import StockChart from "./DonutePieChart";
import TotalIncomeChart from "./TotalIncomeChart";
import { formatToINR } from "../../constants/utilities";
import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import 'simplebar/dist/simplebar.css';
import Loader from "../../components/Loader/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState();
  const [donultChartOptions, setDonultChartOptions] = useState({
    labels: ["Out Of Stock", "In Stock"],
    series: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lineChartOptions, setLineChartOptions] = useState({
    // labels: ["Initial Amount", "Amount Earned"],
    series: [],
    // sample
     // {
      //   name: "2022",
      //   data: [50, 60, 30, 55, 75, 60, 100, 120],
      // },

      // {
      //   name: "2023",
      //   data: [35, 45, 40, 50, 35, 55, 40, 45],
      // },
      // {
      //   name: "2024",
      //   data: [100, 75, 80, 40, 20, 40, 0, 25],
      // },
  });
  
  const getAllProducts = async () => {
    try {
      const response = await apiService.getRequest(`product/admin`);
      const products = response.products;
      console.log("products", products);
      let outOfStock = 0;
      products.forEach((item) => {
        if (item.stock === 0) {
          outOfStock += 1;
        }
      });
      setProducts(products);
      setDonultChartOptions({
        labels: ["Out Of Stock", "In Stock"],
        series: [outOfStock, products?.length - outOfStock],
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const { chartData,orders } = useSelector((state) => state.order);
  const { users } = useSelector((state) => state.user);
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    setIsLoading(true);
    getAllProducts();
    dispatch(getMonthlyReport());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if(chartData && users && orders && products){
      setIsLoading(false);
    }
  }, [chartData,users,orders,products])

  useEffect(() => {
    if (chartData) {
      console.log("chartData", chartData);
      setLineChartOptions({
        ...lineChartOptions,
        ...chartData
      });
      setTotalAmount(chartData?.totalIncome);
    }
  }, [chartData]);

  return (
    <>
    <Loader visible={isLoading}/>
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4 pb-0" data-simplebar="">
              <div className="row flex-nowrap">
                <div className="col">
                  <div className="card primary-gradient">
                    <div className="card-body text-center px-9 pb-4">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded text-bg-primary flex-shrink-0 mb-3 mx-auto">
                        <Icon
                          icon="solar:dollar-minimalistic-linear"
                          className="fs-7 text-white"
                        ></Icon>
                      </div>
                      <h6 className="fw-normal fs-3 mb-1">Total Orders</h6>
                      <h4 className="center-item gap-1">
                        {orders?.length}
                      </h4>
                      <NavLink
                        to="/admin/order-list"
                        className="btn btn-white fs-2 fw-semibold text-nowrap"
                      >
                        View Details
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card warning-gradient">
                    <div className="card-body text-center px-9 pb-4">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded text-bg-warning flex-shrink-0 mb-3 mx-auto">
                        {/* <Icon
                          icon="solar:user-circle-bold"
                          className="fs-7 text-white"
                        ></Icon> */}
                        <i className="ti ti-users fs-6"></i>
                      </div>
                      <h6 className="fw-normal fs-3 mb-1">Users</h6>
                      <h4 className="center-item gap-1">
                        {users?.length}
                      </h4>
                      <NavLink
                        to="/admin/user-list"
                        className="btn btn-white fs-2 fw-semibold text-nowrap"
                      >
                        View Details
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card secondary-gradient">
                    <div className="card-body text-center px-9 pb-4">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded text-bg-secondary flex-shrink-0 mb-3 mx-auto">
                        <Icon
                          icon="solar:box-linear"
                          className="fs-7 text-white"
                        ></Icon>
                      </div>
                      <h6 className="fw-normal fs-3 mb-1">Products</h6>
                      <h4 className="center-item gap-1">
                        {products?.length}
                      </h4>
                      <NavLink
                        to="/admin/product-list"
                        className="btn btn-white fs-2 fw-semibold text-nowrap"
                      >
                        View Details
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row flex-nowrap">
                <div className="col">
                  <div className="card primary-gradient">
                    <div className="card-body text-center px-9 pb-4">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded text-bg-primary flex-shrink-0 mb-3 mx-auto">
                        <Icon
                          icon="solar:dollar-minimalistic-linear"
                          className="fs-7 text-white"
                        ></Icon>
                      </div>
                      <h6 className="fw-normal fs-3 mb-1">Total Orders</h6>
                      <h4 className="center-item gap-1">
                      {orders?.length}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card warning-gradient">
                    <div className="card-body text-center px-9 pb-4">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded text-bg-warning flex-shrink-0 mb-3 mx-auto">
                        {/* <span><i className="ti ti-home-check fs-8"></i></span> */}
                         <Icon
                          icon="tabler:home-check"
                          className="fs-7 text-white"
                        ></Icon>
                      </div>
                      <h6 className="fw-normal fs-3 mb-1">Delivered </h6>
                      <h4 className="center-item gap-1">
                        {orders?.length && orders?.filter((ord) => ord?.orderStatus === 'Delivered')?.length}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card secondary-gradient">
                    <div className="card-body text-center px-9 pb-4">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded text-bg-secondary flex-shrink-0 mb-3 mx-auto">
                        <Icon
                          icon="ic:outline-close"
                          className="fs-7 text-white"
                        ></Icon>
                      </div>
                      <h6 className="fw-normal fs-3 mb-1">Cancelled </h6>
                      <h4 className="center-item gap-1">
                      {orders?.length && orders?.filter((ord) => ord?.orderStatus === 'Cancelled')?.length}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card secondary-gradient">
                    <div className="card-body text-center px-9 pb-4">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded text-bg-secondary flex-shrink-0 mb-3 mx-auto">
                        {/* <span><i className="ti ti-truck-delivery fs-8"></i></span> */}
                         <Icon
                          icon="tabler:truck-delivery"
                          className="fs-7 text-white"
                        ></Icon>
                      </div>
                      <h6 className="fw-normal fs-3 mb-1">Shipped </h6>
                      <h4 className="center-item gap-1">
                      {orders?.length && orders?.filter((ord) => ord?.orderStatus === 'Shipped')?.length}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card success-gradient">
                    <div className="card-body text-center px-9 pb-4">
                      <div className="d-flex align-items-center justify-content-center round-48 rounded text-bg-success flex-shrink-0 mb-3 mx-auto">
                        <Icon
                          icon="uim:process"
                          className="fs-7 text-white"
                        ></Icon>
                      </div>
                      <h6 className="fw-normal fs-3 mb-1">Processing </h6>
                      <h4 className="center-item gap-1">
                        {orders?.length && orders?.filter((ord) => ord?.orderStatus === 'Processing')?.length}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card">
            <div className="card-body">
              <TotalIncomeLineChart chartValues={lineChartOptions} />
              <div className="row mt-4 mb-2">
                <div className="col-md-4">
                  <div className="hstack gap-6 mb-3 mb-md-0">
                    <span className="d-flex align-items-center justify-content-center round-48 bg-light rounded">
                      <Icon
                        icon="solar:pie-chart-2-linear"
                        className="fs-7 text-dark"
                      ></Icon>
                    </span>
                    <div>
                      <span>Total</span>
                      <h5 className="mt-1 fw-medium mb-0">
                        {formatToINR(totalAmount)}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="hstack gap-6 mb-3 mb-md-0">
                    <span className="d-flex align-items-center justify-content-center round-48 bg-primary-subtle rounded">
                      <Icon
                        icon="solar:dollar-minimalistic-linear"
                        className="fs-7 text-primary"
                      ></Icon>
                    </span>
                    <div>
                      <span>Profit</span>
                      <h5 className="mt-1 fw-medium mb-0">
                        {formatToINR(totalAmount)}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="hstack gap-6">
                    <span className="d-flex align-items-center justify-content-center round-48 bg-danger-subtle rounded">
                      <Icon
                        icon="solar:database-linear"
                        className="fs-7 text-danger"
                      ></Icon>
                    </span>
                    <div>
                      <span>Earnings</span>
                      <h5 className="mt-1 fw-medium mb-0">
                        {formatToINR(totalAmount)}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <StockChart donultChartOptions={donultChartOptions} />
        </div>
        {/* <div className="col-lg-4">
          <AnnualProfitChart />
        </div>
        <div className="col-lg-8">
          <RevenueByProduct />
        </div>
        <div className="col-lg-4">
          <TotalIncomeChart />
        </div> */}
        {/* <div className="col-lg-4">
          <TotalSettlements />
        </div> */}
        {/* <div className="col-lg-5">
        <YourPerformance />
        </div> */}
        {/* <div className="col-lg-7">
          <div className="row">
            <div className="col-md-6">
              <CustomerChart />
            </div>
            <div className="col-md-6">
              <SalesOverviewChart />
            </div>
          </div>
        </div> */}
        {/* <div className="col-xxl-4 col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title fw-semibold mb-7">
                Recent Transactions
              </h4>
              <ul className="timeline-widget mb-0 position-relative mb-n5">
                <li className="timeline-item d-flex position-relative overflow-hidden">
                  <div className="timeline-time mt-n1 text-muted flex-shrink-0 text-end">
                    09:46
                  </div>
                  <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                    <span className="timeline-badge bg-primary flex-shrink-0 mt-2"></span>
                    <span className="timeline-badge-border d-block flex-shrink-0"></span>
                  </div>
                  <div className="timeline-desc fs-3 text-dark mt-n1">
                    Payment received from John Doe of $385.90
                  </div>
                </li>
                <li className="timeline-item d-flex position-relative overflow-hidden">
                  <div className="timeline-time mt-n6 text-muted flex-shrink-0 text-end">
                    09:46
                  </div>
                  <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                    <span className="timeline-badge bg-warning flex-shrink-0"></span>
                    <span className="timeline-badge-border d-block flex-shrink-0"></span>
                  </div>
                  <div className="timeline-desc fs-12 text-dark-light mt-n6 fw-medium">
                    New sale recorded{" "}
                    <a
                      href="javascript:void(0)"
                      className="text-primary d-block fw-normal "
                    >
                      #ML-3467
                    </a>
                  </div>
                </li>
                <li className="timeline-item d-flex position-relative overflow-hidden">
                  <div className="timeline-time mt-n6 text-muted flex-shrink-0 text-end">
                    09:46
                  </div>
                  <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                    <span className="timeline-badge bg-warning flex-shrink-0"></span>
                    <span className="timeline-badge-border d-block flex-shrink-0"></span>
                  </div>
                  <div className="timeline-desc fs-3 text-dark mt-n6">
                    Payment was made of $64.95 to Michael
                  </div>
                </li>
                <li className="timeline-item d-flex position-relative overflow-hidden">
                  <div className="timeline-time mt-n6 text-muted flex-shrink-0 text-end">
                    09:46
                  </div>
                  <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                    <span className="timeline-badge bg-secondary flex-shrink-0"></span>
                    <span className="timeline-badge-border d-block flex-shrink-0"></span>
                  </div>
                  <div className="timeline-desc fs-12 text-dark-light mt-n6 fw-medium">
                    New sale recorded{" "}
                    <a
                      href="javascript:void(0)"
                      className="text-primary d-block fw-normal "
                    >
                      #ML-3467
                    </a>
                  </div>
                </li>
                <li className="timeline-item d-flex position-relative overflow-hidden">
                  <div className="timeline-time mt-n6 text-muted flex-shrink-0 text-end">
                    09:46
                  </div>
                  <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                    <span className="timeline-badge bg-danger flex-shrink-0"></span>
                    <span className="timeline-badge-border d-block flex-shrink-0"></span>
                  </div>
                  <div className="timeline-desc fs-12 text-dark-light mt-n6 fw-medium">
                    Project meeting
                  </div>
                </li>
                <li className="timeline-item d-flex position-relative overflow-hidden">
                  <div className="timeline-time mt-n6 text-muted flex-shrink-0 text-end">
                    09:46
                  </div>
                  <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                    <span className="timeline-badge bg-primary flex-shrink-0"></span>
                  </div>
                  <div className="timeline-desc fs-3 text-dark mt-n6">
                    Payment received from John Doe of $385.90
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
