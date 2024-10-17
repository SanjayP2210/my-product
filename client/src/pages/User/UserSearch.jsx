import React, { useEffect } from 'react'

const UserSearch = ({ handleSearchChange, search, handleClearSearch }) => {
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
    <div className="d-flex justify-content-end align-items-center gap-6 mb-9">
      <form className="position-relative">
        {/* <input
          type="text"
          className="form-control search-chat py-2 ps-5"
          id="text-srh search"
          placeholder="Search User"
          name="search"
          value={search}
          onChange={handleSearchChange}
        />
        <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i> */}
        <div className="search-box-input">
          <input
            type="text"
            className="form-control search-order py-2"
            id="text-srh"
            placeholder="Search User"
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

export default UserSearch