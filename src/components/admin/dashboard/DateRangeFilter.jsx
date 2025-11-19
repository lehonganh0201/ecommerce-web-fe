// src/components/admin/dashboard/DateRangeFilter.jsx
import React, { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

const DateRangeFilter = ({ dateRange, onDateRangeChange, onRefresh }) => {
  const [localDateRange, setLocalDateRange] = useState(dateRange);

  const handleApply = () => {
    onDateRangeChange(localDateRange);
    toast.success("Áp dụng bộ lọc thời gian thành công!");
  };

  const handleRefresh = () => {
    onRefresh();
    toast.success("Làm mới dữ liệu thành công!");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Từ ngày:</label>
            <input
              type="datetime-local"
              value={localDateRange.fromDate.slice(0, 16)} // Format for input
              onChange={(e) => setLocalDateRange({ ...localDateRange, fromDate: e.target.value + ":00" })}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Đến ngày:</label>
            <input
              type="datetime-local"
              value={localDateRange.toDate.slice(0, 16)}
              onChange={(e) => setLocalDateRange({ ...localDateRange, toDate: e.target.value + ":00" })}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
          <button
            onClick={handleApply}
            className="px-4 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-medium"
          >
            Áp dụng
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700"
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </button>
      </div>
    </div>
  );
};

export default DateRangeFilter;