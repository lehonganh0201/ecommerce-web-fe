// src/components/admin/warehouseAdmin/WarehouseFilters.jsx
import React, { useState } from "react";
import { Search, Plus, Download, Filter } from "lucide-react";
import WarehouseAvailableFilter from "./WarehouseAvailableFilter";

const WarehouseFilters = ({
  searchQuery,
  onSearchChange,
  availableFilter,
  onAvailableFilterChange,
  cityFilter,
  onCityFilterChange,
  districtFilter,
  onDistrictFilterChange,
  wardFilter,
  onWardFilterChange,
  onExportExcel,
  onAddWarehouse,
  availableCounts,
  totalCount,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
        <div className="w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm kho (tên, địa chỉ)..."
              value={searchQuery}
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <WarehouseAvailableFilter
          availableFilter={availableFilter}
          onFilterChange={onAvailableFilterChange}
          availableCounts={availableCounts}
          totalCount={totalCount}
        />

        <div className="w-full sm:w-auto flex gap-3 flex-wrap">
          <button
            onClick={onExportExcel}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-700 hover:bg-green-500 hover:text-white duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </button>
          <button
            onClick={onAddWarehouse}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm kho
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        className="flex items-center text-sm text-gray-700 hover:text-gray-900 mb-3"
      >
        <Filter className="h-4 w-4 mr-1" />
        {showAdvancedFilters ? "Ẩn" : "Hiện"} bộ lọc nâng cao
      </button>

      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => onCityFilterChange(e.target.value)}
              placeholder="Nhập thành phố"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
            <input
              type="text"
              value={districtFilter}
              onChange={(e) => onDistrictFilterChange(e.target.value)}
              placeholder="Nhập quận/huyện"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
            <input
              type="text"
              value={wardFilter}
              onChange={(e) => onWardFilterChange(e.target.value)}
              placeholder="Nhập phường/xã"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseFilters;