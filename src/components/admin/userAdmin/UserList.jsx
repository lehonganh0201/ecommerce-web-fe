// src/components/admin/userAdmin/UserList.jsx (updated to pass refresh prop)
import React from "react";
import UserListItem from "./UserListItem";
import UserPagination from "./UserPagination";

const UserList = ({
  users,
  apiPage,
  currentPage,
  usersPerPage,
  totalUsers,
  totalPages,
  onPageChange,
  onUsersPerPageChange,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onSort,
  sortConfig,
  hasNext,
  hasPrevious,
  onToggleLock,
  onChangePassword,
  onRefreshUsers, // New prop
}) => {
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("id")}
              >
                ID {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("username")}
              >
                Tên đăng nhập {sortConfig.key === "username" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("roleName")}
              >
                Vai trò {sortConfig.key === "roleName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kích hoạt
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khóa
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("balance")}
              >
                Số dư {sortConfig.key === "balance" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers?.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                onView={onViewUser}
                onEdit={onEditUser}
                onDelete={onDeleteUser}
                onToggleLock={onToggleLock}
                onChangePassword={onChangePassword}
                onRefreshUsers={onRefreshUsers} // Pass the refresh function
              />
            ))}
          </tbody>
        </table>
      </div>

      <UserPagination
        contentUser={users}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={usersPerPage}
        totalItems={totalUsers}
        onPageChange={onPageChange}
        onItemsPerPageChange={onUsersPerPageChange}
        indexOfFirstItemUser={indexOfFirstUser}
        indexOfLastItem={indexOfLastUser}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        itemName="người dùng"
      />
    </div>
  );
};

export default UserList;