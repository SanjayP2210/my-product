import Logo from "../../assets/images/logos/Logo.png";
import { Icon } from "@iconify/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatToINR, setThemeAttributes } from "../../constants/utilities";
import { toast } from "react-toastify";
import apiService from "../../service/apiService";
import { useEffect, useRef, useState } from "react";
import { updateLoginUserData } from "../../reducers/authReducer";
import emptyCardIcon from "../../assets/images/svgs/empty-shopping-cart-95276f54.svg";
import {
  addToCart,
  getCart,
  removeFromCart,
  removeFullProductFromCart,
  resetCartState,
} from "../../reducers/cartReducer";
import defaultProfileImage from "../../assets/images/profile/user-1.jpg";
import "./Navbar.css";
import { menuList, optionMenuList } from "./menu-list";

const Navbar = () => {
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    cartItems,
    isCartUpdated,
    isProductRemoveFromCart,
    totalCount: cartCount,
    totalPrice,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  console.log("items", cartItems);
  const closeSideMenuBtn = useRef();
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  useEffect(() => {
    if(user?.themeColor){
      if (user?.themeColor === "light") {
        setThemeAttributes("light", "light-logo", "dark-logo", "sun", "moon");
      } else {
        setThemeAttributes("dark", "dark-logo", "light-logo", "moon", "sun");
      }
    }
  }, [user?.themeColor]);

  useEffect(() => {
    setProfileImage(user?.image?.url || defaultProfileImage);
  }, [user]);

  const handleColorTheme = async (color) => {
    try {
      const response = await apiService.putRequest(`user/theme/${user?._id}`, {
        color: color,
      });
      if (response?.isError) {
        toast.error("error while update theme", response?.message);
      } else {
        let loginData = JSON.parse(localStorage.getItem("loginUserData"));
        if (color === "light") {
          setThemeAttributes("light", "light-logo", "dark-logo", "sun", "moon");
        } else {
          setThemeAttributes("dark", "dark-logo", "light-logo", "moon", "sun");
        }
        loginData = {
          ...loginData,
          themeColor: color,
        };
        localStorage.setItem("loginUserData", JSON.stringify(loginData));
        dispatch(updateLoginUserData(loginData));
      }
    } catch (error) {
      toast.error("error while update theme", error);
    }
  };

  //****************************
  // Toggle sidebar
  //****************************
  function handleSidebar() {
    document.querySelectorAll(".sidebartoggler").forEach(function (el) {
      el.checked = true;
    });
    document.getElementById("main-wrapper").classList.toggle("show-sidebar");
    document.querySelectorAll(".sidebarmenu").forEach(function (el) {
      el.classList.toggle("close");
    });
    document.getElementById("menu-right-mini-1").classList.add("d-block");
    var dataTheme = document.body.getAttribute("data-sidebartype");
    if (dataTheme === "full") {
      document.body.setAttribute("data-sidebartype", "mini-sidebar");
    } else {
      document.body.setAttribute("data-sidebartype", "full");
    }
  }

  useEffect(() => {
    if (isCartUpdated || isProductRemoveFromCart) {
      dispatch(getCart());
      // dispatch(resetCartState());
    }
  }, [isCartUpdated, isProductRemoveFromCart]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCart());
    }
  }, [isLoggedIn]);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.warn("You must be logged in to process further");
      navigate("/auth/login");
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

  return (
    <>
      <header className="topbar">
        <div className="with-vertical">
          <nav className="navbar navbar-expand-lg p-0">
            <ul className="navbar-nav">
              <Link
                className="nav-link sidebartoggler"
                id="sidebarCollapse"
                href="javascript:void(0)"
                onClick={handleSidebar}
              >
                <Icon
                  icon="solar:hamburger-menu-line-duotone"
                  className={"fs-7"}
                ></Icon>
              </Link>
              <li className="nav-item d-none d-xl-flex nav-icon-hover-bg rounded-circle">
                <Link
                  className="nav-link"
                  href="javascript:void(0)"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  <Icon icon="solar:magnifer-linear" className={"fs-6"}></Icon>
                </Link>
              </li>
            </ul>

            <NavLink to="/" className="d-block d-lg-none py-9 py-xl-0">
              <img src={Logo} style={{ width: "50px" }} className="logo-image" alt="logo-img" />
            </NavLink>
            <Link
              className="navbar-toggler p-0 border-0 nav-icon-hover-bg rounded-circle"
              href="javascript:void(0)"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <Icon
                icon="solar:menu-dots-bold-duotone"
                className={"fs-6"}
              ></Icon>
            </Link>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <div className="d-flex align-items-center justify-content-between">
                <ul className="navbar-nav flex-row mx-auto ms-lg-auto align-items-center justify-content-center">
                  <li className="nav-item dropdown">
                    <Link
                      type="button"
                      className="nav-link cart-icon"
                      style={{ color: "#526b7a" }}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#cartSideMenu"
                      aria-controls="cartSideMenu"
                    >
                      {/* {cartCount > 0 && ( */}
                      <i className="ti ti-shopping-cart"></i>
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary count-icon">
                        {cartCount}
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item nav-icon-hover-bg rounded-circle moon dark-layout">
                    <Link
                      className="nav-link"
                      href="javascript:void(0)"
                      onClick={(e) => {
                        e.preventDefault();
                        handleColorTheme("dark");
                      }}
                    >
                      <Icon
                        icon="solar:moon-line-duotone"
                        className={"moon fs-6"}
                      ></Icon>
                    </Link>
                  </li>
                  <li
                    className="nav-item nav-icon-hover-bg rounded-circle sun light-layout"
                    style={{ display: "none" }}
                  >
                    <Link
                      className="nav-link"
                      href="javascript:void(0)"
                      onClick={(e) => {
                        e.preventDefault();
                        handleColorTheme("light");
                      }}
                    >
                      <Icon
                        icon="solar:sun-line-duotone"
                        className={"sun fs-6"}
                        style={{ fontSize: "24px" }}
                      ></Icon>
                    </Link>
                  </li>

                  <li className="nav-item dropdown nav-icon-hover-bg rounded-circle">
                    <Link
                      className="nav-link position-relative"
                      href="javascript:void(0)"
                      id="drop2"
                      aria-expanded="false"
                    >
                      <Icon
                        icon="solar:bell-bing-line-duotone"
                        className={"fs-6"}
                      ></Icon>
                    </Link>
                    <div
                      className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up"
                      aria-labelledby="drop2"
                    >
                      <div className="d-flex align-items-center justify-content-between py-3 px-7">
                        <h5 className="mb-0 fs-5 fw-semibold">Notifications</h5>
                        <span className="badge text-bg-primary rounded-4 px-3 py-1 lh-sm">
                          5 new
                        </span>
                      </div>
                      <div className="message-body" data-simplebar>
                        <Link
                          href="javascript:void(0)"
                          className="py-6 px-7 d-flex align-items-center dropdown-item gap-3"
                        >
                          <span className="flex-shrink-0 bg-danger-subtle rounded-circle round d-flex align-items-center justify-content-center fs-6 text-danger">
                            <Icon icon="solar:widget-3-line-duotone"></Icon>
                          </span>
                          <div className="w-75">
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="mb-1 fw-semibold">Launch Admin</h6>
                              <span className="d-block fs-2">9:30 AM</span>
                            </div>
                            <span className="d-block text-truncate text-truncate fs-11">
                              Just see the my new admin!
                            </span>
                          </div>
                        </Link>
                        <Link
                          href="javascript:void(0)"
                          className="py-6 px-7 d-flex align-items-center dropdown-item gap-3"
                        >
                          <span className="flex-shrink-0 bg-primary-subtle rounded-circle round d-flex align-items-center justify-content-center fs-6 text-primary">
                            <Icon icon="solar:calendar-line-duotone"></Icon>
                          </span>
                          <div className="w-75">
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="mb-1 fw-semibold">Event today</h6>
                              <span className="d-block fs-2">9:15 AM</span>
                            </div>
                            <span className="d-block text-truncate text-truncate fs-11">
                              Just a reminder that you have event
                            </span>
                          </div>
                        </Link>
                        <Link
                          href="javascript:void(0)"
                          className="py-6 px-7 d-flex align-items-center dropdown-item gap-3"
                        >
                          <span className="flex-shrink-0 bg-secondary-subtle rounded-circle round d-flex align-items-center justify-content-center fs-6 text-secondary">
                            <Icon icon="solar:settings-line-duotone"></Icon>
                          </span>
                          <div className="w-75">
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="mb-1 fw-semibold">Settings</h6>
                              <span className="d-block fs-2">4:36 PM</span>
                            </div>
                            <span className="d-block text-truncate text-truncate fs-11">
                              You can customize this template as you want
                            </span>
                          </div>
                        </Link>
                        <Link
                          href="javascript:void(0)"
                          className="py-6 px-7 d-flex align-items-center dropdown-item gap-3"
                        >
                          <span className="flex-shrink-0 bg-warning-subtle rounded-circle round d-flex align-items-center justify-content-center fs-6 text-warning">
                            <Icon icon="solar:widget-4-line-duotone"></Icon>
                          </span>
                          <div className="w-75">
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="mb-1 fw-semibold">Launch Admin</h6>
                              <span className="d-block fs-2">9:30 AM</span>
                            </div>
                            <span className="d-block text-truncate text-truncate fs-11">
                              Just see the my new admin!
                            </span>
                          </div>
                        </Link>
                        <Link
                          href="javascript:void(0)"
                          className="py-6 px-7 d-flex align-items-center dropdown-item gap-3"
                        >
                          <span className="flex-shrink-0 bg-primary-subtle rounded-circle round d-flex align-items-center justify-content-center fs-6 text-primary">
                            <Icon icon="solar:calendar-line-duotone"></Icon>
                          </span>
                          <div className="w-75">
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="mb-1 fw-semibold">Event today</h6>
                              <span className="d-block fs-2">9:15 AM</span>
                            </div>
                            <span className="d-block text-truncate text-truncate fs-11">
                              Just a reminder that you have event
                            </span>
                          </div>
                        </Link>
                        <Link
                          href="javascript:void(0)"
                          className="py-6 px-7 d-flex align-items-center dropdown-item gap-3"
                        >
                          <span className="flex-shrink-0 bg-secondary-subtle rounded-circle round d-flex align-items-center justify-content-center fs-6 text-secondary">
                            <Icon icon="solar:settings-line-duotone"></Icon>
                          </span>
                          <div className="w-75">
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="mb-1 fw-semibold">Settings</h6>
                              <span className="d-block fs-2">4:36 PM</span>
                            </div>
                            <span className="d-block text-truncate text-truncate fs-11">
                              You can customize this template as you want
                            </span>
                          </div>
                        </Link>
                      </div>
                      <div className="py-6 px-7 mb-1">
                        <button className="btn btn-primary w-100">
                          See All Notifications
                        </button>
                      </div>
                    </div>
                  </li>

                  {/* <li className="nav-item dropdown nav-icon-hover-bg rounded-circle">
                    <Link
                      className="nav-link"
                      href="javascript:void(0)"
                      id="drop2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={iconFlagEn}
                        alt="icon-img"
                        width="20px"
                        height="20px"
                        className="rounded-circle object-fit-cover round-20"
                      />
                    </Link>
                    <div
                      className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                      aria-labelledby="drop2"
                    >
                      <div className="message-body">
                        <Link
                          href="javascript:void(0)"
                          className="d-flex align-items-center gap-2 py-3 px-4 dropdown-item"
                        >
                          <div className="position-relative">
                            <img
                              src={iconFlagEn}
                              alt="icon-img"
                              width="20px"
                              height="20px"
                              className="rounded-circle object-fit-cover round-20"
                            />
                          </div>
                          <p className="mb-0 fs-3">English (UK)</p>
                        </Link>
                        <Link
                          href="javascript:void(0)"
                          className="d-flex align-items-center gap-2 py-3 px-4 dropdown-item"
                        >
                          <div className="position-relative">
                            <img
                              src={iconFlagCn}
                              alt="icon-img"
                              width="20px"
                              height="20px"
                              className="rounded-circle object-fit-cover round-20"
                            />
                          </div>
                          <p className="mb-0 fs-3">中国人 (Chinese)</p>
                        </Link>
                        <Link
                          href="javascript:void(0)"
                          className="d-flex align-items-center gap-2 py-3 px-4 dropdown-item"
                        >
                          <div className="position-relative">
                            <img
                              src={iconFlagFr}
                              alt="icon-img"
                              width="20px"
                              height="20px"
                              className="rounded-circle object-fit-cover round-20"
                            />
                          </div>
                          <p className="mb-0 fs-3">français (French)</p>
                        </Link>
                        <Link
                          href="javascript:void(0)"
                          className="d-flex align-items-center gap-2 py-3 px-4 dropdown-item"
                        >
                          <div className="position-relative">
                            <img
                              src={iconFlagSa}
                              alt="icon-img"
                              width="20px"
                              height="20px"
                              className="rounded-circle object-fit-cover round-20"
                            />
                          </div>
                          <p className="mb-0 fs-3">عربي (Arabic)</p>
                        </Link>
                      </div>
                    </div>
                  </li> */}

                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link"
                      href="javascript:void(0)"
                      id="drop1"
                      aria-expanded="false"
                    >
                      <div className="d-flex align-items-center gap-2 lh-base">
                        <img
                          src={profileImage}
                          className="rounded-circle"
                          width="35"
                          height="35"
                          alt="icon-img"
                        />
                        <Icon
                          icon="solar:alt-arrow-down-bold"
                          className="fs-2"
                        ></Icon>
                      </div>
                    </Link>
                    <div
                      className="dropdown-menu profile-dropdown dropdown-menu-end dropdown-menu-animate-up"
                      aria-labelledby="drop1"
                    >
                      <div className="position-relative px-4 pt-3 pb-2">
                        <div className="d-flex align-items-center mb-3 pb-3 border-bottom gap-6">
                          <img
                            src={profileImage}
                            className="rounded-circle"
                            width="56"
                            height="56"
                            alt="profile-img"
                          />
                          <div>
                            <h5 className="mb-0 fs-12">{user?.name} </h5>
                            <p className="mb-0 text-dark">{user?.email}</p>
                          </div>
                        </div>
                        <div className="message-body">
                          <Link
                            to="/profile"
                            className="p-2 dropdown-item h6 rounded-1"
                          >
                            My Profile
                          </Link>
                          <Link
                            to={"/logout"}
                            className="p-2 dropdown-item h6 rounded-1"
                          >
                            Sign Out
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="app-header with-horizontal">
          <nav className="navbar navbar-expand-xl container-fluid p-0">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item d-flex d-xl-none align-items-center nav-icon-hover-bg rounded-circle">
                <Link
                  className="nav-link sidebartoggler"
                  id="sidebarCollapse"
                  href="javascript:void(0)"
                >
                  <Icon
                    icon="solar:hamburger-menu-line-duotone"
                    className={"fs-7"}
                  ></Icon>
                </Link>
              </li>
              <li className="nav-item d-none d-xl-flex align-items-center">
                <NavLink to="/" className="text-nowrap nav-link">
                  <img src={Logo} style={{ width: "50px" }} className="logo-image" alt="logo-img" />
                </NavLink>
              </li>
              <li className="nav-item d-none d-xl-flex align-items-center nav-icon-hover-bg rounded-circle">
                <Link
                  className="nav-link"
                  href="javascript:void(0)"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  <Icon icon="solar:magnifer-linear" className={"fs-6"}></Icon>
                </Link>
              </li>
            </ul>
            <div className="d-block d-xl-none">
              <NavLink to="/" className="text-nowrap nav-link">
                <img src={Logo} style={{ width: "50px",filter: "drop-shadow(9px 5px 7px #4444C3)" }} alt="logo-img" />
              </NavLink>
            </div>
            <Link
              className="navbar-toggler nav-icon-hover p-0 border-0 nav-icon-hover-bg rounded-circle"
              href="javascript:void(0)"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="p-2">
                <i className="ti ti-dots fs-7"></i>
              </span>
            </Link>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <div className="d-flex align-items-center justify-content-between px-0 px-xl-8">
                <ul className="navbar-nav flex-row mx-auto ms-lg-auto align-items-center justify-content-center">
                  <li className="nav-item d-block d-xl-none">
                    <Link
                      className="nav-link nav-icon-hover-bg rounded-circle"
                      href="javascript:void(0)"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <Icon
                        icon="solar:magnifer-line-duotone"
                        className={"fs-6"}
                      ></Icon>
                    </Link>
                  </li>
                  <li className="nav-item dropdown nav-icon-hover-bg rounded-circle">
                    <Link
                      type="button"
                      className="nav-link cart-icon"
                      style={{ color: "#526b7a" }}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#cartSideMenu"
                      aria-controls="cartSideMenu"
                    >
                      {/* {cartCount > 0 && ( */}
                      <i className="ti ti-shopping-cart"></i>
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary count-icon">
                        {cartCount}
                      </span>
                      {/* )} */}
                    </Link>
                  </li>
                  <li className="nav-item nav-icon-hover-bg rounded-circle moon dark-layout">
                    <Link
                      className="nav-link"
                      href="javascript:void(0)"
                      onClick={(e) => {
                        e.preventDefault();
                        handleColorTheme("dark");
                      }}
                    >
                      <Icon
                        icon="solar:moon-line-duotone"
                        className={"moon fs-6"}
                      ></Icon>
                    </Link>
                  </li>
                  <li
                    className="nav-item nav-icon-hover-bg rounded-circle sun light-layout"
                    style={{ display: "none" }}
                  >
                    <Link
                      className="nav-link"
                      href="javascript:void(0)"
                      onClick={(e) => {
                        e.preventDefault();
                        handleColorTheme("light");
                      }}
                    >
                      <Icon
                        icon="solar:sun-line-duotone"
                        className={"sun fs-6"}
                        style={{ fontSize: "24px" }}
                      ></Icon>
                    </Link>
                  </li>
                  <li className="nav-item dropdown nav-icon-hover-bg rounded-circle">
                    <Link
                      className="nav-link position-relative"
                      href="javascript:void(0)"
                      id="drop2"
                      aria-expanded="false"
                    >
                      <Icon
                        icon="solar:bell-bing-line-duotone"
                        className={"fs-6"}
                      ></Icon>
                    </Link>
                  </li>
                  {!isLoggedIn && <li className="nav-item dropdown nav-icon-hover-bg rounded-circle">
                    <Link
                      className="nav-link position-relative"
                      to={"/auth/login"}
                      aria-expanded="false"
                    >
                      <span className="center-item">
                          <i className={"fs-6 ti ti-login"}></i>
                      </span>
                    </Link>
                  </li>}
                  {isLoggedIn && <li className="nav-item dropdown">
                    <Link
                      className="nav-link"
                      href="javascript:void(0)"
                      id="drop1"
                      aria-expanded="false"
                    >
                      <div className="d-flex align-items-center gap-2 lh-base">
                        <img
                          src={profileImage}
                          className="rounded-circle"
                          width="35"
                          height="35"
                          alt="profile-img"
                        />
                        <Icon
                          icon="solar:alt-arrow-down-bold"
                          className="fs-2"
                        ></Icon>
                      </div>
                    </Link>
                   <div
                      className="dropdown-menu profile-dropdown dropdown-menu-end dropdown-menu-animate-up"
                      aria-labelledby="drop1"
                    >
                      <div className="position-relative px-4 pt-3 pb-2">
                        <div className="d-flex align-items-center mb-3 pb-3 border-bottom gap-6">
                          <img
                            src={user?.image?.url || defaultProfileImage}
                            className="rounded-circle"
                            width="56"
                            height="56"
                            alt="profile-img"
                          />
                          <div>
                            <h5 className="mb-0 fs-12">{user?.name}</h5>
                            <p className="mb-0 text-dark">{user?.email}</p>
                          </div>
                        </div>
                        <div className="message-body">
                          {optionMenuList?.map((item) => {
                            return (
                              <>
                                <NavLink
                                  to={item?.link}
                                  className="p-2 dropdown-item h6 rounded-1"
                                >
                                  {item?.title}
                                </NavLink>
                              </>
                            );
                          })}
                          {/* <Link
                            href="../main/page-pricing.html"
                            className="p-2 dropdown-item h6 rounded-1"
                          >
                            My Subscription
                          </Link>
                          <Link
                            href="../main/app-invoice.html"
                            className="p-2 dropdown-item h6 rounded-1"
                          >
                            My Invoice{" "}
                            <span className="badge bg-danger-subtle text-danger rounded ms-8">
                              4
                            </span>
                          </Link>
                          <Link
                            href="../main/page-account-settings.html"
                            className="p-2 dropdown-item h6 rounded-1"
                          >
                            Account Settings
                          </Link> */}
                        </div>
                      </div>
                    </div>
                  </li>}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <aside className="left-sidebar with-horizontal">
        <div>
          <nav
            id="sidebarnavh"
            className="sidebar-nav scroll-sidebar container-fluid"
          >
            <ul id="sidebarnav">
              <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span className="hide-menu">Home</span>
              </li>

              <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span className="hide-menu">Apps</span>
              </li>
              {isLoggedIn &&
                isAdmin &&
                <>
                  <li className="sidebar-item">
                        <NavLink
                          href="javascript:void(0)"
                          aria-expanded="false"
                          className={({ isActive }) => {
                            return `sidebar-link two-column has-arrow ${
                              window?.location?.pathname?.startsWith("/master")
                                ? "active"
                                : ""
                            }`;
                          }}
                        >
                          <span>
                            <Icon
                              icon="solar:widget-line-duotone"
                              className="ti"
                            ></Icon>
                          </span>
                          <span className="hide-menu">Master</span>
                        </NavLink>
                        <ul
                          aria-expanded="false"
                          className="collapse first-level"
                        >
                          {menuList?.masterList?.map((item) => {
                            return (
                              <>
                                <li className="sidebar-item">
                                  <NavLink
                                    to={item.link}
                                    className={({ isActive }) => {
                                      return `sidebar-link ${
                                        isActive ? "active" : ""
                                      }`;
                                    }}
                                  >
                                    <i className="ti ti-list-check"></i>
                                    <span className="hide-menu">
                                      {item.title}
                                    </span>
                                  </NavLink>
                                </li>
                              </>
                            );
                          })}
                        </ul>
                      </li>

                      <li className="sidebar-item">
                        <NavLink
                          href="javascript:void(0)"
                          aria-expanded="false"
                          className={({ isActive }) => {
                            return `sidebar-link two-column has-arrow ${
                              window?.location?.pathname?.startsWith("/admin/")
                                ? "active"
                                : ""
                            }`;
                          }}
                        >
                          <span>
                            <Icon
                              icon="solar:widget-line-duotone"
                              className="ti"
                            ></Icon>
                          </span>
                          <span className="hide-menu">Lists</span>
                        </NavLink>
                        <ul
                          aria-expanded="false"
                          className="collapse first-level"
                        >
                          {menuList?.adminMenuList?.map((item) => {
                            return (
                              <>
                                <li className="sidebar-item">
                                  <NavLink
                                    to={item.link}
                                    className={({ isActive }) => {
                                      return `sidebar-link ${
                                        isActive ? "active" : ""
                                      }`;
                                    }}
                                  >
                                    <i className="ti ti-list-check"></i>
                                    <span className="hide-menu">
                                      {item.title}
                                    </span>
                                  </NavLink>
                                </li>
                              </>
                            );
                          })}
                        </ul>
                      </li>
                </>
              }
              {isLoggedIn &&
                menuList?.userMenuList?.map((item) => {
                  return (
                    <>
                      <li className="sidebar-item">
                        <NavLink
                          to={item.link}
                          className={({ isActive }) => {
                            return `sidebar-link ${isActive ? "active" : ""}`;
                          }}
                        >
                          <i className={`${item.icon ? item.icon : 'ti ti-list-check'}`}></i>
                          <span className="hide-menu">{item.title}</span>
                        </NavLink>
                      </li>
                    </>
                  );
                })}
            </ul>
          </nav>
          {/*  */}
        </div>
      </aside>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="cartSideMenu"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Shopping Cart</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            ref={closeSideMenuBtn}
          ></button>
        </div>
        <div className="offcanvas-body overflow-hidden">
          <div className="container mt-1 scroll-bar nav-cart-section">
            {cartItems?.length > 0 ? (
              cartItems?.map((product, index) => {
                return (
                  <>
                    <div
                      key={product?._id}
                      className="row no-gutters cart-details-section"
                      style={{ padding: "10px 0px" }}
                    >
                      <div className="card-image-div col-xs-4 col-sm-4 col-md-4">
                        <img
                          src={product?.image}
                          style={{ width: "80px" }}
                          className="card-img"
                          alt={"cart-image"}
                        />
                      </div>
                      <div className="col-xs-8 col-sm-8 col-md-8">
                        <h6 className="cart-title">{product?.productName}</h6>
                        {product?.categories?.length && (
                          <p className="cart-categories-text">
                            {product?.categories?.map((categ, index1) => {
                              return (
                                <>
                                  {index1 + 1 != product?.categories?.length
                                    ? `${categ}, `
                                    : categ}
                                </>
                              );
                            })}
                          </p>
                        )}
                        <a
                          href="javascript:void(0)"
                          className="text-danger fs-4"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(removeFullProductFromCart(product?._id));
                          }}
                        >
                          <i className="ti ti-trash"></i>
                        </a>
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="mb-0">
                            {formatToINR(product?.updatedPrice)}
                          </h6>
                          <div
                            className="btn-group ml-3"
                            role="group"
                            aria-label="Quantity buttons"
                          >
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                dispatch(removeFromCart(product?._id))
                              }
                            >
                              -
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                            >
                              <b>{product?.quantity}</b>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product);
                              }}
                              disabled={product?.quantity === product?.stock}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index + 1 != cartItems?.length && <hr />}
                  </>
                );
              })
            ) : (
              <>
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-md-12 text-center">
                      <img
                        src={emptyCardIcon}
                        alt="cart"
                        width="200px"
                        className="img-fluid"
                      />
                      <h5 className="mt-3">Cart is Empty</h5>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={(e) => {
                          e.preventDefault();
                          closeSideMenuBtn?.current?.click();
                          navigate("/");
                        }}
                      >
                        Go back to Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {cartItems?.length > 0 && totalPrice > 0 && (
            <div className="container">
              <div className="d-flex justify-content-between align-items-center pt-3">
                <h6>Total</h6>
                <h6>{formatToINR(totalPrice)}</h6>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-primary btn-md btn-block mt-2"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    closeSideMenuBtn?.current?.click();
                    navigate("checkout-product");
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
