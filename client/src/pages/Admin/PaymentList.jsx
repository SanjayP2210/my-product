import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _, { debounce } from "lodash";
import upArrow from "../../assets/images/svgs/up-arrow.svg";
import downArrow from "../../assets/images/svgs/down-arrow.svg";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Loader from "../../components/Loader/Loader";
import PaymentTable from "./PaymentTable";
import { getAllPayments } from "../../reducers/orderReducer";

const PaymentList = () => {
  const [paymentList, setPaymentsList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("paymentName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [limit, setLimit] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const { payments, isLoading } = useSelector((state) => state.order);
  const debouncedFetchResults = useCallback(
    debounce((searchQuery) => fetchPayments(searchQuery), 500),
    []
  );
  const dispatch = useDispatch();
  const { isAdmin, isLoggedIn } = useSelector((state) => state.auth);
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
    if (payments) {
      setPaymentsList(payments || []);
    }
  }, [payments]);

  useEffect(() => {
    if (isSearching) return;
    const params = new URLSearchParams({
      page,
      search,
      sortBy,
      sortOrder,
      limit,
    });

    fetchPayments(params);
  }, [page, sortBy, sortOrder, search, limit]);

  const fetchPayments = async (params) => {
    try {
      dispatch(getAllPayments(params));
    } catch (error) {
      console.error("Error fetching payments:", error);
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

  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid">
        <BreadCrumb title={"Payment list"} />

        <div className="payment-list">
          <div className="card">
            <div className="card-body p-3">
              <PaymentTable
                handleSort={handleSort}
                getSortIcon={getSortIcon}
                paymentList={paymentList}
                setPage={setPage}
                page={page}
                setLimit={setLimit}
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

export default PaymentList;
