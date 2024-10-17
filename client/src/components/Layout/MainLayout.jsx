import React, { useEffect, useRef } from 'react'
import MiniSidebar from '../Navbar/MiniSidebar'
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    const sidebarRef = useRef(null);
    const handleClickOutside = (event) => {
      const mainWrapper = document.getElementById("main-wrapper");
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (mainWrapper.classList.contains("show-sidebar")) {
          mainWrapper.classList.toggle("show-sidebar");
        }
      } else {
        if (event.target.classList.contains("menu-link") || event.target.classList.contains("sidebar-link")) {
          mainWrapper.classList.toggle("show-sidebar");
        }
      }
    };
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="main-wrapper">
        <MiniSidebar sidebarRef={sidebarRef} />
        <div className="page-wrapper">
          <div className="body-wrapper scroll-bar">
            <Navbar />
            <Outlet />
          </div>
        </div>
      </div>
  )
}

export default MainLayout