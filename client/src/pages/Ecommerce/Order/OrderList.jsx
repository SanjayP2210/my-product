import { useCallback, useEffect, useState } from "react";
import apiService from "../../../service/apiService";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import _, { debounce } from "lodash";
import upArrow from "../../../assets/images/svgs/up-arrow.svg";
import downArrow from "../../../assets/images/svgs/down-arrow.svg";
import Loader from "../../../components/Loader/Loader";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import OrderTable from "./OrderTable";
import OrderSearch from "./OrderSearch";
import "./../index.css";
import { getAllOrders, myOrders } from "../../../reducers/orderReducer";

const OrderList = () => {
  const [orderList, setOrdersList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("orderName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [limit, setLimit] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const { orders, isLoading } = useSelector((state) => state.order);
  const debouncedFetchResults = useCallback(
    debounce((searchQuery) => fetchOrders(searchQuery), 500),
    []
  );
  const dispatch = useDispatch();
  const {
    isAdmin,
    isLoggedIn,
  } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isSearching) {
      const params = new URLSearchParams({
        page,
        sortBy,
        search,
        sortOrder,
        limit,
      });
      debouncedFetchResults(params);
      setIsSearching(false);
    }
    // Cancel any pending debounced function calls when the component unmounts or query changes
    return () => {
      debouncedFetchResults.cancel();
    };
  }, [search, debouncedFetchResults]);

  useEffect(() => {
    if (orders) {
      setOrdersList(orders || []);
    }
  }, [orders]);

  useEffect(() => {
    if (isSearching) return;
    const params = new URLSearchParams({
      page,
      search,
      sortBy,
      sortOrder,
      limit,
    });

    fetchOrders(params);
  }, [page, sortBy, sortOrder, search, limit]);

  const handleSearchChange = (e) => {
    setIsSearching(true);
    setSearch(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setIsSearching(true);
    setSearch("");
    setPage(1);
  };

  const fetchOrders = async (params) => {
    try {
      if(window.location.pathname.includes('my-order')){
        dispatch(myOrders(params));
      }else{
        dispatch(getAllOrders(params))
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setSortBy(key);
    setSortOrder(direction);
    setPage(1);
  };

  const getSortIcon = (key) => {
    sortBy;
    if (sortConfig.key !== key) {
      return null;
    }
    return (
      <img
        style={{ background: "white", borderRadius: "50%" }}
        src={sortConfig.direction === "asc" ? upArrow : downArrow}
        alt={sortConfig.direction === "asc" ? "up-arrow" : "down-arrow"}
      />
    );
  };

  const removeOrder = async (id) => {
    try {
      const response = await apiService.deleteRequest(`order/admin-order/${id}`);
      if (response) {
        toast.success("Order deleted successfully!");
        const params = new URLSearchParams({
          page,
          search,
          sortBy,
          sortOrder,
          limit,
        });

        fetchOrders(params);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order:", error);
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid">
        <BreadCrumb title={"Order list"} />

        <div className="order-list">
          <div className="card">
            <div className="card-body p-3">
              <OrderSearch
                handleSearchChange={handleSearchChange}
                search={search}
                handleClearSearch={handleClearSearch}
              />
              <OrderTable
                handleSort={handleSort}
                getSortIcon={getSortIcon}
                orderList={orderList}
                setPage={setPage}
                page={page}
                setLimit={setLimit}
                removeOrder={removeOrder}
                totalPages={totalPages}
                totalCount={totalCount}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderList;
