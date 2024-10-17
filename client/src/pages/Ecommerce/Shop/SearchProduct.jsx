/* eslint-disable no-undef */
import React, { useEffect } from 'react'

const SearchProduct = ({ handleSearchChange, search, handleClearSearch }) => {

  useEffect(() => {
    let inputBox = document.querySelector(".search-box-input"),
      searchIcon = document.querySelector(".search"),
      closeIcon = document.querySelector(".close-icon");

    // ---- ---- Open Input ---- ---- //
    searchIcon.addEventListener("click", () => {
      inputBox.classList.add("open");
    });
    // ---- ---- Close Input ---- ---- //
    closeIcon.addEventListener("click", () => {
      inputBox.classList.remove("open");
    });
  }, []);

  return (
    <div className="d-flex justify-content-between align-items-center gap-6 mb-4">
      <a
        className="btn btn-primary d-lg-none d-flex"
        data-bs-toggle="offcanvas"
        href="#filtercategory"
        role="button"
        aria-controls="filtercategory"
      >
        <i className="ti ti-menu-2 fs-6"></i>
      </a>
      <h5 className="fs-5 mb-0 d-none d-lg-block">Products</h5>
      <form className="position-relative">
        {/* <input
          type="search"
          className="form-control py-2 ps-5"
          id="text-srh"
          placeholder="Search Product"
          onChange={handleSearchChange}
          value={search}
        />
        <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i> */}
        {/* <div className="search-wrapper">
          <div className="input-holder">
            <input
              type="search"
              className="form-control search-product py-2 ps-5 search-input"
              id="text-srh"
              placeholder="Search Product"
              onChange={handleSearchChange}
              value={search}
            />
            <button
              className="search-icon"
              onClick={(event) => {
                searchToggle(event);
              }}
            >
              <span></span>
            </button>
          </div>
          <span
            className="close"
            onClick={(event) => {
              searchToggle(event);
            }}
          ></span>
        </div> */}
        <div className="search-box-input">
          <input
            type="text"
            className="form-control search-product py-2"
            id="text-srh"
            placeholder="Search Product"
            onChange={handleSearchChange}
            value={search}
          />
          <span className="search">
            <i className="ti ti-search search-icon"></i>
          </span>
          <i
            className="ti ti-x close-icon"
            onClick={() => {
              if (search) {
                handleClearSearch("");
              }
            }}
          ></i>
        </div>
      </form>
    </div>
  );
};

export default SearchProduct