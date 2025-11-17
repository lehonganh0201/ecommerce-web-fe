import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import LayoutAdmin from "./LayoutAdmin";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { motion } from "framer-motion";
import UserFilters from "@/components/admin/userAdmin/UserFilters";
import UserList from "@/components/admin/userAdmin/UserList";
import UserViewModal from "@/components/admin/userAdmin/UserViewModal";
import UserFormModal from "@/components/admin/userAdmin/UserFormModal";
import { exportUsersToExcel } from "@/components/admin/userAdmin/userExcel";
import DeleteUserModal from "@/components/admin/userAdmin/DeleteUserModal";
import ChangePasswordModal from "@/components/admin/userAdmin/ChangePasswordModal";
import {
  getUsers,
  deleteUser,
  updateUser,
  toggleUserLock,
  getUserById,
  changeUserPassword
} from "@/apis/user";

const UserAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(true);
  const [apiPage, setApiPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [statusFilter, setStatusFilter] = useState("All"); // For enabled status
  const [lockFilter, setLockFilter] = useState("All"); // For locked status
  const [token, setToken] = useState(
    localStorage.getItem("accessToken")
      ? localStorage.getItem("accessToken")
      : null
  );

  const refreshUsers = () => {
    // Refetch the current page with current filters
    const enabledFilter = statusFilter === "All" ? null : statusFilter === "Enabled";
    const lockedFilter = lockFilter === "All" ? null : lockFilter === "Locked";
    const sortBy = sortConfig.key || "createdAt";
    const sortDir = sortConfig.direction || "desc";
    getAllUsers(
      apiPage,
      itemsPerPage,
      searchQuery,
      enabledFilter,
      lockedFilter,
      sortBy,
      sortDir
    );
  };

  const getAllUsers = async (
    page = 0,
    size = itemsPerPage,
    search = "",
    enabled = null,
    locked = null,
    sortBy = null,
    sortDir = null
  ) => {
    try {
      const params = {
        page,
        size,
        searchKey: search,
        ...(enabled !== null && { enabled }),
        ...(locked !== null && { locked }),
        ...(sortBy && { sortBy }),
        ...(sortDir && { sortDirection: sortDir }),
      };
      const res = await getUsers(params);
      setUsers(res.data);
      setAllUsers(res.data);
      setHasNext(res.meta.hasNext);
      setHasPrevious(res.meta.hasPrevious);
      setTotalItems(res.meta.totalElements);
      setTotalPages(res.meta.totalPages);
      setApiPage(res.meta.currentPage || res.meta.number || 0);
      setCurrentPage((res.meta.currentPage || res.meta.number || 0) + 1);
      setItemsPerPage(res.meta.pageSize || res.meta.size);
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || "Unknown"}`
      );
      console.log(err);
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    const enabledFilter = statusFilter === "All" ? null : statusFilter === "Enabled";
    const lockedFilter = lockFilter === "All" ? null : lockFilter === "Locked";
    const sortBy = sortConfig.key || "createdAt";
    const sortDir = sortConfig.direction || "desc";
    getAllUsers(
      apiPage,
      itemsPerPage,
      searchQuery,
      enabledFilter,
      lockedFilter,
      sortBy,
      sortDir
    );
  }, [apiPage, itemsPerPage, searchQuery, statusFilter, lockFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setApiPage(0);
    setCurrentPage(1);
    const enabledFilter = statusFilter === "All" ? null : statusFilter === "Enabled";
    const lockedFilter = lockFilter === "All" ? null : lockFilter === "Locked";
    const sortBy = sortConfig.key || "createdAt";
    const sortDir = sortConfig.direction || "desc";
    getAllUsers(0, size, searchQuery, enabledFilter, lockedFilter, sortBy, sortDir);
  };

  const handlePageChange = (page) => {
    setApiPage(page - 1);
    setCurrentPage(page);
    const enabledFilter = statusFilter === "All" ? null : statusFilter === "Enabled";
    const lockedFilter = lockFilter === "All" ? null : lockFilter === "Locked";
    const sortBy = sortConfig.key || "createdAt";
    const sortDir = sortConfig.direction || "desc";
    getAllUsers(
      page - 1,
      itemsPerPage,
      searchQuery,
      enabledFilter,
      lockedFilter,
      sortBy,
      sortDir
    );
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleLockFilterChange = (newLock) => {
    setLockFilter(newLock);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal("view");
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal("edit");
  };

  const handleDeleteUserClick = (user) => {
    setSelectedUser(user);
    setShowModal("delete");
  };

  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setShowModal("changePassword");
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await deleteUser(id);
      if (response.status === 204) {
        toast.success("Xóa người dùng thành công");
        setShowModal(null);
        const enabledFilter = statusFilter === "All" ? null : statusFilter === "Enabled";
        const lockedFilter = lockFilter === "All" ? null : lockFilter === "Locked";
        const sortBy = sortConfig.key || "createdAt";
        const sortDir = sortConfig.direction || "desc";
        getAllUsers(
          apiPage,
          itemsPerPage,
          searchQuery,
          enabledFilter,
          lockedFilter,
          sortBy,
          sortDir
        );
      }
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || ""}`
      );
      console.log(err);
    }
  };

  const handleExportExcel = () => {
    exportUsersToExcel(users);
  };

  const handleToggleLock = async (user) => {
    try {
      const request = { locked: !user.locked };
      const res = await toggleUserLock(user.id, request);
      toast.success("Thay đổi trạng thái khóa thành công!");
      const enabledFilter = statusFilter === "All" ? null : statusFilter === "Enabled";
      const lockedFilter = lockFilter === "All" ? null : lockFilter === "Locked";
      const sortBy = sortConfig.key || "createdAt";
      const sortDir = sortConfig.direction || "desc";
      getAllUsers(
        apiPage,
        itemsPerPage,
        searchQuery,
        enabledFilter,
        lockedFilter,
        sortBy,
        sortDir
      );
      if (lockFilter !== "All" && request.locked !== (lockFilter === "Locked")) {
        setLockFilter("All");
        toast.info("Đã chuyển sang xem tất cả để hiển thị thay đổi");
      }
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} \n Nguyên nhân: ${err.response?.statusText || ""}`
      );
    }
  };

  const handleFormSubmit = async (formData, avatarFile) => {
    const formdata = new FormData();
    formdata.append("firstName", formData.firstName || "");
    formdata.append("lastName", formData.lastName || "");
    formdata.append("email", formData.email || "");
    formdata.append("phoneNumber", formData.phoneNumber || "");
    formdata.append("dateOfBirth", formData.dateOfBirth || "");
    formdata.append("isMale", formData.isMale || false);
    formdata.append("roleId", formData.roleId || "");
    formdata.append("enabled", formData.enabled || true);

    if (avatarFile) {
      formdata.append("avatarFile", avatarFile);
    }

    try {
      const response = await updateUser(selectedUser.id, formdata);
      if (response.status === 200) {
        toast.success("Cập nhật người dùng thành công");
      }
      setShowModal(null);
      const enabledFilter = statusFilter === "All" ? null : statusFilter === "Enabled";
      const lockedFilter = lockFilter === "All" ? null : lockFilter === "Locked";
      const sortBy = sortConfig.key || "createdAt";
      const sortDir = sortConfig.direction || "desc";
      getAllUsers(
        apiPage,
        itemsPerPage,
        searchQuery,
        enabledFilter,
        lockedFilter,
        sortBy,
        sortDir
      );
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} \n Nguyên nhân: ${err.response?.statusText || ""}`
      );
      console.log(err);
    }
  };

  const handleChangePasswordSubmit = async (passwordData) => {
    try {
      const request = { newPassword: passwordData.newPassword, confirmPassword: passwordData.confirmPassword };
      const response = await changeUserPassword(selectedUser.id, request);
      if (response.status === 200) {
        toast.success("Thay đổi mật khẩu thành công");
      }
      setShowModal(null);
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} \n Nguyên nhân: ${err.response?.statusText || ""}`
      );
      console.log(err);
    }
  };

  const statusCounts = {
    all: allUsers.length,
    enabled: allUsers.filter(u => u.enabled === true).length,
    disabled: allUsers.filter(u => u.enabled === false).length,
  };

  const lockCounts = {
    all: allUsers.length,
    unlocked: allUsers.filter(u => u.locked === false).length,
    locked: allUsers.filter(u => u.locked === true).length,
  };

  return (
    <LayoutAdmin>
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAdmin title={"Quản lý người dùng"} />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UserFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              lockFilter={lockFilter}
              onLockFilterChange={handleLockFilterChange}
              onExportExcel={handleExportExcel}
              statusCounts={statusCounts}
              lockCounts={lockCounts}
              totalCount={allUsers.length}
            />

            <UserList
              users={filteredUsers.length > 0 ? filteredUsers : users}
              apiPage={apiPage}
              currentPage={currentPage}
              usersPerPage={itemsPerPage}
              totalUsers={totalItems}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onUsersPerPageChange={handleItemsPerPageChange}
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUserClick}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onSort={handleSort}
              sortConfig={sortConfig}
              onToggleLock={handleToggleLock}
              onChangePassword={handleChangePassword}
              onRefreshUsers={refreshUsers}
            />
            {showModal === "view" && selectedUser && (
              <UserViewModal
                user={selectedUser}
                onClose={() => setShowModal(null)}
                onEdit={handleEditUser}
                token={token}
              />
            )}

            {showModal === "edit" && selectedUser && (
              <UserFormModal
                isOpen={true}
                onClose={() => setShowModal(null)}
                onSubmit={handleFormSubmit}
                initialData={selectedUser}
                formType="edit"
              />
            )}

            {showModal === "delete" && selectedUser && (
              <DeleteUserModal
                isOpen={true}
                onClose={() => setShowModal(null)}
                onConfirm={handleDeleteUser}
                user={selectedUser}
              />
            )}

            {showModal === "changePassword" && selectedUser && (
              <ChangePasswordModal
                isOpen={true}
                onClose={() => setShowModal(null)}
                onSubmit={handleChangePasswordSubmit}
                userId={selectedUser.id}
              />
            )}
          </motion.div>
        </main>
      </div>
    </LayoutAdmin>
  );
};

export default UserAdminPage;