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
import ProductTable from "./ProductTable";
import ProductSearch from "./ProductSearch";
import './../index.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("productName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [limit, setLimit] = useState(10);
  const [category, setCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProductDeleted, setIsProductDeleted] = useState(false);
  //  const { error, loading, users, status, isProductProductDeleted, response } = useSelector(
  //    (state) => {
  //      return state.user;
  //    }
  //  );

  // Debounced function
  const debouncedFetchResults = useCallback(
    debounce((searchQuery) => fetchProducts(searchQuery), 500),
    []
  );

  useEffect(() => {
    if (isSearching) {
      const params = new URLSearchParams({
        page,
        sortBy,
        search,
        sortOrder,
        limit,
        category,
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
    if (isSearching) return;
    const params = new URLSearchParams({
      page,
      search,
      sortBy,
      sortOrder,
      limit,
      category,
    });

    fetchProducts(params);
  }, [page, sortBy, sortOrder, search, limit]);

  //  useEffect(() => {
  //    if (!loading && response) {
  //      setProducts(response?.users || []);
  //      setTotalPages(response?.totalPages);
  //    }
  //  }, [response]);

  //  useEffect(() => {
  //    if (error) {
  //      toast.error(error);
  //    }
  //  }, [error]);

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

  const fetchProducts = async (params) => {
    try {
      setIsLoading(true);
      const response = await apiService.getRequest(
        `product?${params?.toString()}`
      );
      setProducts(response.products || []);
      setTotalPages(response?.totalPages);
      setTotalCount(response?.totalCount);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching products:", error);
    }
  };

  const formatedDate = (date) => {
    const currentDate = date ? new Date(date) : new Date();

    const options = {
      weekday: "short", // Short weekday name (e.g., Thu)
      month: "short", // Short month name (e.g., Jun)
      day: "2-digit", // Two-digit day of the month (e.g., 28)
      year: "numeric", // Full year (e.g., 2024)
    };

    return date
      ? currentDate?.toLocaleDateString("en-US", options)
      : new Intl.DateTimeFormat("en-US", options).format(currentDate);
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

  const removeProduct = async (id) => {
    try {
      setIsLoading(true);
      const response = await apiService.deleteRequest(`product/${id}`);
      if (response) {
        toast.success("Product deleted successfully!");
        setIsLoading(false);
        setIsProductDeleted(true);
        const params = new URLSearchParams({
          page,
          search,
          sortBy,
          sortOrder,
          limit,
          category,
        });

        fetchProducts(params);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid">
        <BreadCrumb title={"Product list"} />

        <div className="product-list">
          <div className="card">
            <div className="card-body p-3">
              <ProductSearch
                handleSearchChange={handleSearchChange}
                search={search}
                handleClearSearch={handleClearSearch}
              />
              <ProductTable
                handleSort={handleSort}
                getSortIcon={getSortIcon}
                products={products}
                formatedDate={formatedDate}
                setPage={setPage}
                page={page}
                setLimit={setLimit}
                removeProduct={removeProduct}
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

export default ProductList;
