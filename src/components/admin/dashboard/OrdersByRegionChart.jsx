// src/components/admin/dashboard/OrdersByRegionChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MapPin, ShoppingCart } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#9966FF"];

const OrdersByRegionChart = ({ ordersByRegion }) => {
  const { totalOrders = 0, regions = [], regionLevel = "CITY" } = ordersByRegion || {};

  // Data cho PieChart (sử dụng percentage cho tỷ lệ)
  const chartData = regions.map((region, index) => ({
    name: region.name || "Unknown",
    value: region.percentage || 0,
    orderCount: region.orderCount || 0,
    fill: COLORS[index % COLORS.length],
  }));

  // Helper để render category breakdown (Map -> list)
  const renderCategoryBreakdown = (breakdown) => {
    if (!breakdown || Object.keys(breakdown).length === 0) return <span className="text-gray-400">Không có</span>;
    return (
      <ul className="text-xs text-gray-600 space-y-1">
        {Object.entries(breakdown).map(([cat, count]) => (
          <li key={cat}>{cat}: {count}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng theo khu vực</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Level: {regionLevel} | Tổng đơn: {totalOrders.toLocaleString()}</span>
        </div>
      </div>

      {/* Regions Pie Chart */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Tỷ lệ đơn hàng theo {regionLevel.toLowerCase()}</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value.toFixed(1)}% (${props.payload.orderCount} đơn)`,
                `Khu vực: ${name}`,
              ]}
              labelFormatter={(label) => `${regionLevel}: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Regions Details Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Chi tiết {regionLevel.toLowerCase()}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{regionLevel}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phân loại theo category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regions.map((region, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{region.orderCount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{region.percentage.toFixed(1)}%</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {renderCategoryBreakdown(region.categoryBreakdown)}
                  </td>
                </tr>
              ))}
              {regions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Không có dữ liệu khu vực</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersByRegionChart;