import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../constants/utilities";
import Select2 from "../../components/Select2/Select2";
import { useDispatch } from "react-redux";
import { updateUser, updateUserRole } from "../../reducers/userReducer";

const UserTable = ({
  handleSort,
  getSortIcon,
  userList,
  formatedDate,
  setPage,
  page,
  setLimit,
  removeUser,
  totalPages,
  totalCount,
  isEditFlow,
  setIsEditFlow,
  setUsersList,
}) => {
  const adminOptions = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];
  const [adminValue, setAdminValue] = useState();
  console.log("adminValue", adminValue);
  const dispatch  = useDispatch();

  const handleEditForm = (user)=>{
    const formObj = {
        ...user,
        isAdmin : adminValue?.value
    }

    dispatch(updateUserRole(formObj));
  }

  return (
    <div className="table-responsive buser rounded scroll-bar">
      <table
        style={{ width: "100%" }}
        className="table align-middle mb-0 sortable-table"
      >
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              <b>Name {getSortIcon("name")}</b>
            </th>
            <th style={{ width: "30%" }} onClick={() => handleSort("email")}>
              <b>Email {getSortIcon("email")}</b>
            </th>
            <th
              style={{ width: "25%" }}
              onClick={() => handleSort("mobileNumber")}
            >
              <b>Mobile Number {getSortIcon("mobileNumber")}</b>
            </th>
            <th style={{ width: "20%" }} onClick={() => handleSort("isAdmin")}>
              <b>isAdmin {getSortIcon("isAdmin")}</b>
            </th>
            <th
              style={{ width: "30%" }}
              onClick={() => handleSort("createdAt")}
            >
              <b>Created Date {getSortIcon("createdAt")}</b>
            </th>
            {/* <th style={{ width: "15%" }} onClick={() => handleSort("themeColor")}>
              <b>Theme Color {getSortIcon("themeColor")}</b>
            </th> */}
            <th scope="col" style={{ width: "10%" }}>
              <b>Actions</b>
            </th>
          </tr>
        </thead>
        <tbody>
          {userList?.length > 0 ? (
            userList?.map((user, index) => {
              return (
                <>
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={user?.image?.url}
                          alt={"thumbnail"}
                          width="56"
                          height="56"
                        />
                        <div className="ms-3">
                          <h6 className="fw-semibold mb-0 fs-4">
                            {user?.name}
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <h6 className="mb-0">{user?.email}</h6>
                    </td>
                    <td>
                      <h6 className="mb-0">{user?.mobileNumber}</h6>
                    </td>
                    <td>
                      {user?.isEdit ? (
                        <Select2
                          name="isAdmin"
                          id="isAdmin"
                          isSearchable={false}
                          isClearable={false}
                          options={adminOptions}
                          value={adminValue}
                          handleOnChange={(value)=>{
                            setAdminValue(value);
                          }}
                        />
                      ) : (
                        <h6 className="mb-0">{user?.isAdmin ? "Yes" : "No"}</h6>
                      )}
                    </td>
                    <td>
                      <h6 className="mb-0">{formatDate(user?.createdAt)}</h6>
                    </td>
                    {/* <td>
                      <h6 className="mb-0">{user?.themeColor}</h6>
                    </td> */}
                    <td>
                      {!user?.isEdit ? (
                        <>
                          {/* <a
                            className="fs-6"
                            href="javascript:void(0)"
                            onClick={() => {
                              setIsEditFlow(true);
                            }}
                          >
                            <i className="ti ti-info-circle-filled"></i>
                          </a> */}
                          <a
                            className="fs-6"
                            href="javascript:void(0)"
                            style={{ marginLeft: "20px" }}
                            onClick={() => {
                              const adminVal = adminOptions.filter(
                                (a) => a.value === user?.isAdmin
                              );
                              setAdminValue(
                                adminVal ? adminVal[0] : adminOptions[1]
                              );
                              const updatedUsers = userList.map((userData) => {
                                  return {
                                    ...userData,
                                    isEdit: (userData?._id === user?._id),
                                  }
                              });
                              setUsersList(updatedUsers);
                            }}
                          >
                            <i className="ti ti-edit"></i>
                          </a>
                          <a
                            className="fs-6"
                            href="javascript:void(0)"
                            style={{ marginLeft: "20px" }}
                            onClick={() => {
                              removeUser(user?._id);
                            }}
                          >
                            <i className="ti ti-trash"></i>
                          </a>
                        </>
                      ) : (
                        <>
                        <a
                            className="fs-6"
                            href="javascript:void(0)"
                            style={{ marginLeft: "20px" }}
                            onClick={(e) => {
                                e.preventDefault();
                                handleEditForm(user);
                            }}
                          >
                            <i className="ti ti-device-floppy"></i>
                          </a>
                          <a
                            className="fs-6"
                            href="javascript:void(0)"
                            style={{ marginLeft: "20px" }}
                            onClick={() => {
                              setUsersList(
                                userList.map((userData) => {
                                    return {
                                        ...userData,
                                        isEdit: false,
                                      }
                                })
                              );
                            }}
                          >
                            <i className="ti ti-x"></i>
                          </a>
                        </>
                      )}
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex align-items-center justify-content-end py-1">
        <p className="mb-0 fs-2">Rows per page:</p>
        <select
          className="form-select w-auto ms-0 ms-sm-2 me-8 me-sm-4 py-1 pe-7 ps-2 buser-0"
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
        <p className="mb-0 fs-2">
          {`${page * 1} - ${userList?.length} of ${totalCount}`}
        </p>
        <nav aria-label="...">
          <ul className="pagination justify-content-center mb-0 ms-8 ms-sm-9">
            <li className="page-item p-1">
              <a
                className="page-link buser-0 rounded-circle text-dark fs-6 round-32 d-flex align-items-center justify-content-center"
                href="javascript:void(0)"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <i className="ti ti-chevron-left"></i>
              </a>
            </li>
            <li className="page-item p-1">
              <a
                className="page-link buser-0 rounded-circle text-dark fs-6 round-32 d-flex align-items-center justify-content-center"
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

export default UserTable;
