import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom';
import Logo from "../../assets/images/logos/Logo.png";
import { useSelector } from 'react-redux';
import { menuList } from './menu-list';

const MiniSidebar = ({ sidebarRef }) => {
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);
  function handleSidebar() {
    document.getElementById("main-wrapper").classList.toggle("show-sidebar");
    document.querySelectorAll(".sidebarmenu").forEach(function (el) {
      el.classList.toggle("close");
    });
    document.getElementById("menu-right-mini-1").classList.add("d-block");
    //  menu-right-mini-1
    var dataTheme = document.body.getAttribute("data-sidebartype");
    if (dataTheme === "full") {
      document.body.setAttribute("data-sidebartype", "mini-sidebar");
    } else {
      document.body.setAttribute("data-sidebartype", "full");
    }
  }

  useEffect(() => {
    document
      .querySelectorAll("ul#sidebarnav ul li a.active")
      .forEach(function (link) {
        link.closest("ul").classList.add("in");
        link.closest("ul").parentElement.classList.add("selected");
      });
    document
      .querySelectorAll(".mini-nav .mini-nav-item")
      .forEach(function (item) {
        item.addEventListener("click", function () {
          var id = this.id;
          document
            .querySelectorAll(".mini-nav .mini-nav-item")
            .forEach(function (navItem) {
              navItem.classList.remove("selected");
            });
          this.classList.add("selected");
          document.querySelectorAll(".sidebarmenu nav").forEach(function (nav) {
            nav.classList.remove("d-block");
          });
          document.getElementById("menu-right-" + id).classList.add("d-block");
          document.body.setAttribute("data-sidebartype", "full");
        });
      });
  }, []);

  const pagesRoutes = [
    "add-product",
    "checkout-product",
    "shop",
    "product-list",
  ];

  return (
    <aside className="side-mini-panel with-vertical" ref={sidebarRef}>
      <div>
        <div className="iconbar">
          <div>
            <div className="mini-nav">
              <div className="brand-logo d-flex align-items-center justify-content-center">
                <NavLink
                  className="nav-link sidebartoggler"
                  id="sidebarCollapse"
                  href="javascript:void(0)"
                  onClick={handleSidebar}
                >
                  <Icon
                    icon="solar:hamburger-menu-line-duotone"
                    className={"fs-7 mini-nav-icon"}
                  ></Icon>
                </NavLink>
              </div>
              <ul className="mini-nav-ul" data-simplebar>
              {isLoggedIn &&
                isAdmin && 
                <><NavLink
                  className={({ isActive }) => {
                    return `mini-nav-item ${
                      window?.location?.pathname?.startsWith("/master")
                        ? "selected"
                        : ""
                    }`;
                  }}
                  id="mini-1"
                >
                  <Link
                  >
                    <Icon
                      icon="solar:widget-line-duotone"
                      className={"fs-7 mini-nav-icon"}
                    ></Icon>
                  </Link>
                </NavLink>
                <NavLink
                  className={({ isActive }) => {
                    return `mini-nav-item ${
                      window?.location?.pathname?.startsWith("/master")
                        ? "selected"
                        : ""
                    }`;
                  }}
                  id="admin-list"
                >
                  <Link>
                    <Icon
                      icon="line-md:list"
                      className={"fs-7 mini-nav-icon"}
                    ></Icon>
                  </Link>
                </NavLink>
                </>
                }
                {isLoggedIn &&
                <NavLink
                  className={({ isActive }) => {
                    return `mini-nav-item ${
                     pagesRoutes.includes(window?.location?.pathname?.split("/")[2])
                        ? "selected"
                        : ""
                    }`;
                  }}
                  id="mini-2"
                >
                  <Link
                  >
                    <Icon
                      icon="solar:notes-line-duotone"
                      className={"fs-7 mini-nav-icon"}
                    ></Icon>
                  </Link>
                </NavLink>
                }
              </ul>
            </div>
            <div className="sidebarmenu">
              <div className="brand-logo d-flex justify-content-center align-items-center nav-logo">
                <NavLink to="/" className="text-nowrap logo-img">
                  <img src={Logo} style={{ width: "50px" }} alt="logo-img" />
                </NavLink>
              </div>
                <nav
                  className="sidebar-nav"
                  id="menu-right-mini-1"
                  data-simplebar
                >
                   {isLoggedIn &&
                isAdmin &&
                  <ul className="sidebar-menu" id="sidebarnav">
                    <li className="nav-small-cap">
                      <span className="hide-menu">Master</span>
                    </li>
                    {menuList?.masterList?.map((item) => {
                            return (
                              <>
                                <li className="sidebar-item">
                      <NavLink
                        to={item.link}
                        className={({ isActive }) => {
                          return `sidebar-link ${isActive ? "active" : ""}`;
                        }}
                      >
                        <i className="ti ti-list-check"></i>
                        <span className="hide-menu menu-link"> {item.title}</span>
                      </NavLink>
                    </li>
                              </>
                            );
                          })}
                  </ul>
              }
                </nav>
                <nav
                  className="sidebar-nav"
                  id="menu-right-admin-list"
                  data-simplebar
                >
                   {isLoggedIn &&
                isAdmin &&
                  <ul className="sidebar-menu" id="sidebarnav">
                    <li className="nav-small-cap">
                      <span className="hide-menu">List</span>
                    </li>
                    {isLoggedIn &&
                  isAdmin && menuList?.adminMenuList?.map((item) => {
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
              }
                </nav>

              <nav
                className="sidebar-nav scroll-sidebar"
                id="menu-right-mini-2"
                data-simplebar
              >
                <ul className="sidebar-menu" id="sidebarnav">
                  <li className="nav-small-cap">
                    <span className="hide-menu menu-link">Pages</span>
                  </li>
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
                          <i className="ti ti-list-check"></i>
                          <span className="hide-menu">{item.title}</span>
                        </NavLink>
                      </li>
                    </>
                  );
                })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MiniSidebar