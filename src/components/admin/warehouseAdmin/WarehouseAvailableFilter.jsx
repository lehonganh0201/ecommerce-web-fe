// src/components/admin/warehouseAdmin/WarehouseAvailableFilter.jsx
import React from "react";

const WarehouseAvailableFilter = ({ availableFilter, onFilterChange, availableCounts, totalCount }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Trạng thái sẵn có:</span>
      <div className="flex gap-1">
        <button
          onClick={() => onFilterChange(true)}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            availableFilter === true
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
        >
          Sẵn có ({availableCounts.available})
        </button>
        <button
          onClick={() => onFilterChange(false)}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            availableFilter === false
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          Không sẵn có ({availableCounts.unavailable})
        </button>
        <button
          onClick={() => onFilterChange(null)}
          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
            availableFilter === null
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          Tất cả ({totalCount})
        </button>
      </div>
    </div>
  );
};

export default WarehouseAvailableFilter;