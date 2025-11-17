import React from "react";

const UserStatusFilter = ({ statusFilter, onFilterChange, statusCounts, totalCount }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Trạng thái kích hoạt:</span>
      <div className="flex gap-1">
        <button
          onClick={() => onFilterChange("All")}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            statusFilter === "All"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          Tất cả ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange("Enabled")}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            statusFilter === "Enabled"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
        >
          Kích hoạt ({statusCounts.enabled})
        </button>
        <button
          onClick={() => onFilterChange("Disabled")}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            statusFilter === "Disabled"
              ? "bg-gray-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Vô hiệu hóa ({statusCounts.disabled})
        </button>
      </div>
    </div>
  );
};

export default UserStatusFilter;