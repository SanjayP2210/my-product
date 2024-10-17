import { useCallback, useEffect, useRef, useState } from "react";
import apiService from "../../../service/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import Loader from "../../../components/Loader/Loader";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart, resetCartState } from "../../../reducers/cartReducer";
import { addToCartInfoToast } from "../../../constants/utilities";
import FilterMenu from "./FilterMenu";
import SearchProduct from "./SearchProduct";
import NoProductFoundSection from "./NoProductFoundSection";
import ShopProductList from "./ShopProductList";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";

const Shop = () => {
  const [productList, setProductList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const { cartItems, isCartUpdated } = useSelector((state) => state.cart);
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);
  console.log("productList", productList);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit, setLimit] = useState(50);
  const [category, setCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProductDeleted, setIsProductDeleted] = useState(false);
  const rangeRef = useRef(null);
  const [isRangeValueChange, setIsRangeValueChange] = useState(false);
  const [genderList, setGenderList] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [maximumPrice, setMaximumPrice] = useState(0);
  const [rangeValue, setRangeValue] = useState([0, maximumPrice || 10000]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSortBy = (value) => {
    setSortBy(value?.field);
    setSortOrder(value?.order);
  };

  const resetFilter = () => {
    setPage(1);
    setTotalPages(1);
    setSearch("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setLimit(50);
    setCategory("");
    setSelectedColor("");
    setSelectedGender("");
    setRangeValue([0, maximumPrice]);
  };

  useEffect(() => {
    fetchGender();
    fetchCategories();
    getMaxPriceOfProducts();
  }, []);

  useEffect(() => {
    if (isCartUpdated) {
      // dispatch(resetCartState());
      addToCartInfoToast();
      // dispatch(getCart());
    }
  }, [isCartUpdated]);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.warn('You must be logged in to process further');
      navigate("/auth/login");
      return;
    }
    let limitExist = false;
    if (cartItems && cartItems?.length > 0) {
      const isExist = cartItems.find(
        (item) => item.productId.toString() === product._id
      );
      if (isExist?.productId) {
        limitExist = isExist?.quantity === isExist?.stock;
      }
    }
    if (limitExist) return;
    const formData = {
      productId: product._id,
      quantity: 1,
      price: product?.updatedPrice,
      productName: product?.productName,
      image: product?.image,
      stock: product?.stock,
      updatedPrice: product?.updatedPrice,
    };
    dispatch(addToCart(formData));
  };

  // Debounced function
  const debouncedFetchResults = useCallback(
    debounce((searchQuery) => fetchProducts(searchQuery), 500),
    []
  );

  useEffect(() => {
    if (isSearching) {
      const [minPrice, maxPrice] = rangeValue;
      let urlParams = {
        page,
        sortBy,
        search,
        sortOrder,
        limit,
        category,
        gender: selectedGender,
        color: selectedColor,
        minPrice,
        maxPrice,
      };
      const params = new URLSearchParams(urlParams);
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
    fetchProducts();
  }, [
    page,
    sortBy,
    sortOrder,
    search,
    limit,
    category,
    selectedGender,
    selectedColor,
  ]);

  const fetchGender = async () => {
    try {
      const response = await apiService.getRequest("gender");
      if (response) {
        const filteredGender = response?.gender?.map((data) => {
          return {
            value: data?.name,
            label: data?.name,
          };
        });
        setGenderList(filteredGender);
      }
    } catch (error) {
      toast.error("error while fetching gender", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getRequest("category");
      if (response) {
        const filteredCategories = response?.category?.map((category) => {
          return {
            icon: `ti ${category?.icon}`,
            value: category?.name,
            label: category?.name,
          };
        });
        filteredCategories.unshift({
          icon: "ti ti-circles",
          value: "",
          label: "All",
        });
        console.log("filteredCategories", filteredCategories);
        setCategoriesList(filteredCategories);
      }
    } catch (error) {
      toast.error("error while fetching category", error);
      console.log("error", error);
    }
  };

  const handleSearchChange = (e) => {
    setIsSearching(true);
    setSearch(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setIsSearching(true);
    setSearch('');
    setPage(1);
  }

  useEffect(() => {
    if (isRangeValueChange) {
      fetchProducts();
    }
  }, [isRangeValueChange]);

  const handleRangeValue = (value) => {
    if (value[0] == rangeValue[0] && value[1] == rangeValue[1]) return;
    setIsRangeValueChange(true);
  };

  const fetchProducts = async (paramsValue) => {
    try {
      let params;
      if (paramsValue) {
        params = paramsValue;
      } else {
        if (maximumPrice === 0) return;
        const [minPrice, maxPrice] = rangeValue;
        const urlParams = {
          page,
          sortBy,
          search,
          sortOrder,
          limit,
          category,
          gender: selectedGender,
          color: selectedColor,
          minPrice,
          maxPrice,
        };
        params = new URLSearchParams(urlParams);
      }
      setIsLoading(true);
      const response = await apiService.getRequest(
        `product/shop?${params?.toString()}`
      );
      setProductList(response.products || []);
      setIsProductLoaded(true);
      setTotalPages(response?.totalPages);
      setIsLoading(false);
      setIsRangeValueChange(false);
    } catch (error) {
      setIsLoading(false);
      setIsProductLoaded(true);
      console.error("Error fetching products:", error);
    }
  };

  const getMaxPriceOfProducts = async () => {
    if (maximumPrice) {
      return false;
    }
    try {
      setIsLoading(true);
      const response = await apiService.getRequest("product/max-price");
      if (!response.isError) {
        if (response?.maximumPrice) {
          setMaximumPrice(response?.maximumPrice || 0);
          setRangeValue((prev) => {
            return [0, response?.maximumPrice];
          });
          setIsRangeValueChange(true);
        } else {
          setIsLoading(false);
          console.error("Error getMaxPriceOfProducts:", response?.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error getMaxPriceOfProducts:", error);
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid">
        <BreadCrumb title={"Shop"} />

        <div className="card position-relative overflow-hidden">
          <div className="shop-part d-flex w-100">
            <div className="shop-filters flex-shrink-0 border-end d-none d-lg-block">
              <FilterMenu
                setCategory={setCategory}
                category={category}
                categoriesList={categoriesList}
                handleSortBy={handleSortBy}
                sortBy={sortBy}
                sortOrder={sortOrder}
                maximumPrice={maximumPrice}
                rangeRef={rangeRef}
                rangeValue={rangeValue}
                setRangeValue={(value) => {
                  setRangeValue(value);
                  handleRangeValue(value);
                }}
                selectedGender={selectedGender}
                genderList={genderList || []}
                handleOnChange={(event) => {
                  if (event === null) {
                    setSelectedGender("");
                  } else {
                    setSelectedGender(event?.value);
                  }
                }}
                setSelectedColor={setSelectedColor}
                selectedColor={selectedColor}
                resetFilter={resetFilter}
                isProductLoaded={isProductLoaded}
              />
            </div>
            <div className="card-body p-4 pb-0">
              <SearchProduct
                handleSearchChange={handleSearchChange}
                search={search}
                handleClearSearch={handleClearSearch}
              />
              <div className="row">
                {productList?.length === 0 ? (
                  <>
                    <NoProductFoundSection resetFilter={resetFilter} />
                  </>
                ) : (
                  <>
                    {/* <div className="shop-container"> */}
                    {productList?.map((product, index) => {
                      return (
                        <>
                          <ShopProductList
                            product={product}
                            index={index}
                            handleAddToCart={handleAddToCart}
                          />
                        </>
                      );
                    })}
                    {/* </div> */}
                  </>
                )}
              </div>
            </div>

            <div
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="filtercategory"
              aria-labelledby="filtercategoryLabel"
            >
              <div className="offcanvas-body shop-filters w-100 p-0">
                <FilterMenu
                  setCategory={setCategory}
                  category={category}
                  categoriesList={categoriesList}
                  handleSortBy={handleSortBy}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  maximumPrice={maximumPrice}
                  rangeRef={rangeRef}
                  rangeValue={rangeValue}
                  setRangeValue={(value) => {
                    setRangeValue(value);
                    handleRangeValue(value);
                  }}
                  genderList={genderList || []}
                  selectedGender={selectedGender}
                  handleOnChange={(event) => {
                    if (event === null) {
                      setSelectedGender("");
                    } else {
                      setSelectedGender(event?.value);
                    }
                  }}
                  setSelectedColor={setSelectedColor}
                  selectedColor={selectedColor}
                  resetFilter={resetFilter}
                  isProductLoaded={isProductLoaded}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
