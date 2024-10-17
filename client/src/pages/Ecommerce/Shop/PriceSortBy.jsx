import React, { useState } from 'react'

const PriceSortBy = ({ handleSortBy, sortBy, sortOrder }) => {
  const [sortByList, setSortByList] = useState([
    {
      icon: "ti ti-ad-2 fs-",
      value: { field: "createdAt", order: "desc" },
      label: "Newest",
    },
    {
      icon: "ti ti-sort-ascending-2",
      value: { field: "updatedPrice", order: "desc" },
      label: "Price: High-Low",
    },
    {
      icon: "ti ti-sort-descending-2",
      value: { field: "updatedPrice", order: "asc" },
      label: "Price: Low-High",
    },
    // {
    //   icon: "ti ti-ad-2 fs-5",
    //   value: { field: "discounted", order: "asc" },
    //   label: "Discounted",
    // },
  ]);
  return (
    <>
      {sortByList?.map((sort,index) => {
        return (
          <>
            <li key={index} className="border-0 p-0 mx-4 mb-2">
              <a
                className={`d-flex align-items-center gap-6  text-dark px-3 py-6 rounded-1 sort-by-list-item-action 
                          cursor-pointer ${
                            sort?.value?.field === sortBy &&
                            sort?.value?.order === sortOrder
                              ? "active"
                              : ""
                          }`}
                href="javascript:void(0)"
                onClick={(e) => {
                  e.target.blur();
                  handleSortBy(sort?.value);
                }}
              >
                <i className={sort?.icon}></i>
                {sort?.label}
              </a>
            </li>
          </>
        );
      })}
    </>
  );
};

export default PriceSortBy