// src/components/admin/dashboard/TopAttributesChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Settings, Tag } from "lucide-react";

const TopAttributesChart = ({ topAttributes }) => {
  const { totalVariantsWithAttributes = 0, topAttributes: attributes = [], topN = 5 } = topAttributes || {};

  // Data cho BarChart (sử dụng variantCount cho bar height, % trong tooltip)
  const chartData = attributes.map((attr, index) => ({
    attributeName: attr.attributeName || "Unknown",
    attributeValue: attr.attributeValue || "N/A",
    variantCount: attr.variantCount || 0,
    percentage: attr.percentage || 0,
    fill: index % 2 === 0 ? "#0088FE" : "#00C49F",
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top thuộc tính sản phẩm</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            Tổng variants có attributes: {totalVariantsWithAttributes.toLocaleString()} | Top {topN}
          </span>
        </div>
      </div>

      {/* Top Attributes Bar Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="horizontal">
          <XAxis dataKey="attributeValue" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => [
              `${value} variants (${props.payload.percentage.toFixed(1)}%)`,
              `${props.payload.attributeName}: ${name}`,
            ]}
          />
          <Legend />
          <Bar dataKey="variantCount" />
        </BarChart>
      </ResponsiveContainer>

      {chartData.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Không có dữ liệu thuộc tính</p>
      )}
    </div>
  );
};

export default TopAttributesChart;