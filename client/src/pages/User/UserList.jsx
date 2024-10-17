import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import upArrow from "../../assets/images/svgs/up-arrow.svg";
import downArrow from "../../assets/images/svgs/down-arrow.svg";
import UserTable from "./UserTable";
import UserSearch from "./UserSearch";
import "./index.css";
import apiService from "../../service/apiService";
import Loader from "../../components/Loader/Loader";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import { fetchAllUsers, fetchUsersById } from "../../reducers/userReducer";

const UserList = () => {
  const [userList, setUsersList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [limit, setLimit] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditFlow, setIsEditFlow] = useState(false);
  const { users, isLoading, isUserUpdated } = useSelector(
    (state) => state.user
  );
  //   const [isLoading, setIsLoading] = useState(false);
  const debouncedFetchResults = useCallback(
    debounce((searchQuery) => fetchUsers(searchQuery), 500),
    []
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isUserUpdated) {
      toast.success('User updated successfully');
      const params = new URLSearchParams({
        page,
        search,
        sortBy,
        sortOrder,
        limit,
      });

      fetchUsers(params);
    }
  }, [isUserUpdated]);

  useEffect(() => {
    if (isSearching) {
      const params = new URLSearchParams({
        page,
        sortBy,
        search,
        sortOrder,
        limit,
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
    if (users) {
      const updatedList = users.map((user) => {
        return {
          ...user,
          isEdit: false,
        };
      });
      setUsersList(updatedList || []);
    }
  }, [users]);

  useEffect(() => {
    if (isSearching) return;
    const params = new URLSearchParams({
      page,
      search,
      sortBy,
      sortOrder,
      limit,
    });

    fetchUsers(params);
  }, [page, sortBy, sortOrder, search, limit]);

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

  const fetchUsers = async (params) => {
    try {
      dispatch(fetchAllUsers(params));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
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
        style={{ background: "white", buserRadius: "50%" }}
        src={sortConfig.direction === "asc" ? upArrow : downArrow}
        alt={sortConfig.direction === "asc" ? "up-arrow" : "down-arrow"}
      />
    );
  };

  const removeUser = async (id) => {
    try {
      const response = await apiService.deleteRequest(`user/admin/${id}`);
      if (response) {
        toast.success("User deleted successfully!");
        const params = new URLSearchParams({
          page,
          search,
          sortBy,
          sortOrder,
          limit,
        });

        fetchUsers(params);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid">
        <BreadCrumb title={"User list"} />

        <div className="user-list">
          <div className="card">
            <div className="card-body p-3">
              <UserSearch
                handleSearchChange={handleSearchChange}
                search={search}
                handleClearSearch={handleClearSearch}
              />
              <UserTable
                handleSort={handleSort}
                getSortIcon={getSortIcon}
                userList={userList}
                setPage={setPage}
                page={page}
                setLimit={setLimit}
                removeUser={removeUser}
                totalPages={totalPages}
                totalCount={totalCount}
                isEditFlow={isEditFlow}
                setIsEditFlow={setIsEditFlow}
                setUsersList={setUsersList}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
