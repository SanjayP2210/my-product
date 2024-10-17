import React from 'react'
import { useNavigate } from 'react-router-dom';
import { formatToINR } from '../../../constants/utilities';

const ProductTable = ({
  handleSort,
  getSortIcon,
  products,
  formatedDate,
  setPage,
  page,
  setLimit,
  removeProduct,
  totalPages,
  totalCount,
}) => {
  const navigate = useNavigate();
  return (
    <div className="table-responsive border rounded scroll-bar">
      <table
        style={{ width: "100%" }}
        className="table align-middle mb-0 sortable-table"
      >
        <thead>
          <tr>
            <th
              style={{ width: "40%" }}
              onClick={() => handleSort("productName")}
            >
              Products {getSortIcon("productName")}
            </th>
            <th
              style={{ width: "15%" }}
              onClick={() => handleSort("createdAt")}
            >
              Date {getSortIcon("createdAt")}
            </th>
            <th style={{ width: "10%" }} onClick={() => handleSort("status")}>
              Status {getSortIcon("status")}
            </th>
            <th style={{ width: "10%" }} onClick={() => handleSort("stock")}>
              stock {getSortIcon("stock")}
            </th>
            <th
              style={{ width: "10%" }}
              onClick={() => handleSort("updatedPrice")}
            >
              Price {getSortIcon("updatedPrice")}
            </th>
            <th scope="col" style={{ width: "10%" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.length > 0 ? (
            products?.map((prod, index) => {
              return (
                <>
                  <tr key={prod?._id}>
                    <td width={"200px"}>
                      <div className="d-flex align-items-center">
                        <img
                          src={prod?.image?.[0]}
                          alt={"thumbnail"}
                          width="56"
                          height="56"
                        />
                        <div className="ms-3">
                          <h6 className="fw-semibold mb-0 fs-4">
                            {prod?.productName}
                          </h6>
                          <div className="d-flex align-items-center">
                            {prod?.categories?.map((categ, index1) => {
                              return (
                                <p className="mb-0" key={index1}>
                                  {index1 + 1 != prod?.categories?.length
                                    ? `${categ?.name}, `
                                    : categ?.name}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <h6 className="mb-0">
                        {formatedDate(prod?.createdAt) || formatedDate()}
                      </h6>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                      <span
                        className={`badge fs-2 fw-semibold ${
                          prod?.status === "In Stock"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {prod?.status}
                      </span>
                      {/* <span className={`p-1 rounded-circle  ${
                          prod?.status === "In Stock"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}></span>
                            <p className="mb-0 ms-2">
                              {prod?.status}
                            </p> */}
                      </div>
                    </td>
                    <td>
                      <h6 className="mb-0 fs-4">{prod?.stock}</h6>
                    </td>
                    <td>
                      <h6 className="mb-0 fs-4">{formatToINR(prod?.updatedPrice)}</h6>
                    </td>
                    <td>
                      <a
                        className="fs-6"
                        href="javascript:void(0)"
                        onClick={() => {
                          navigate(`/product-detail/${prod._id}`);
                        }}
                      >
                        <i className="ti ti-info-circle-filled"></i>
                      </a>
                      <a
                        className="fs-6"
                        href="javascript:void(0)"
                        style={{ marginLeft: "20px" }}
                        onClick={() => {
                          navigate(`/admin/edit-product/${prod._id}`);
                        }}
                      >
                        <i className="ti ti-edit"></i>
                      </a>
                      <a
                        className="fs-6"
                        href="javascript:void(0)"
                        style={{ marginLeft: "20px" }}
                        onClick={() => {
                          removeProduct(prod?._id);
                        }}
                      >
                        <i className="ti ti-trash"></i>
                      </a>
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex align-items-center justify-content-end py-1">
        <p className="mb-0 fs-2">Rows per page:</p>
        <select
          className="form-select w-auto ms-0 ms-sm-2 me-8 me-sm-4 py-1 pe-7 ps-2 border-0"
          aria-label="Default select example"
          onChange={(e) => {
            setPage(1);
            setLimit(e.target.value);
          }}
        >
          <option value="5">5</option>
          <option selected value="10">
            10
          </option>
          <option value="25">25</option>
        </select>
        <p className="mb-0 fs-2">{`
                    ${page * 1} - ${products?.length}
                   of ${totalCount}`}</p>
        <nav aria-label="...">
          <ul className="pagination justify-content-center mb-0 ms-8 ms-sm-9">
            <li className="page-item p-1">
              <a
                className="page-link border-0 rounded-circle text-dark fs-6 round-32 d-flex align-items-center justify-content-center"
                href="javascript:void(0)"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <i className="ti ti-chevron-left"></i>
              </a>
            </li>
            <li className="page-item p-1">
              <a
                className="page-link border-0 rounded-circle text-dark fs-6 round-32 d-flex align-items-center justify-content-center"
                href="javascript:void(0)"
                onClick={() =>
                  setPage((prev) => {
                    return Math.min(prev + 1, totalPages);
                  })
                }
                disabled={page === totalPages}
              >
                <i className="ti ti-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductTable