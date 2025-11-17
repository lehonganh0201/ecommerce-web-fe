import React from "react";

const UserLockFilter = ({ lockFilter, onFilterChange, lockCounts, totalCount }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Trạng thái khóa:</span>
      <div className="flex gap-1">
        <button
          onClick={() => onFilterChange("All")}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            lockFilter === "All"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          Tất cả ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange("Unlocked")}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            lockFilter === "Unlocked"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
        >
          Mở khóa ({lockCounts.unlocked})
        </button>
        <button
          onClick={() => onFilterChange("Locked")}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            lockFilter === "Locked"
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          Khóa ({lockCounts.locked})
        </button>
      </div>
    </div>
  );
};

export default UserLockFilter;