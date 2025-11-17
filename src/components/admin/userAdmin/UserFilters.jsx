import React from "react";
import { Search, Download, Key } from "lucide-react";
import UserStatusFilter from "./UserStatusFilter";
import UserLockFilter from "./UserLockFilter";

const UserFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  lockFilter,
  onLockFilterChange,
  onExportExcel,
  statusCounts,
  lockCounts,
  totalCount,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
      <div className="w-full sm:w-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng (tên, email, ID)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex gap-4">
        <UserStatusFilter
          statusFilter={statusFilter}
          onFilterChange={onStatusFilterChange}
          statusCounts={statusCounts}
          totalCount={totalCount}
        />
        <UserLockFilter
          lockFilter={lockFilter}
          onFilterChange={onLockFilterChange}
          lockCounts={lockCounts}
          totalCount={totalCount}
        />
      </div>

      <div className="w-full sm:w-auto flex gap-3 flex-wrap">
        <button
          onClick={onExportExcel}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-700 hover:bg-green-500 hover:text-white duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Xuất thành Excel
        </button>
      </div>
    </div>
  );
};

export default UserFilters;