// src/components/admin/dashboard/ProductCategoryChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Package, Tag } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"]; 

const ProductCategoryChart = ({ productsByCategory }) => {
  const { totalActiveProducts = 0, totalActiveVariants = 0, categories = [], top5Categories = [] } = productsByCategory || {};

  // Data cho PieChart từ top5Categories (sử dụng percentageProducts cho tỷ lệ)
  const chartData = top5Categories.map((category, index) => ({
    name: category.name || "Unknown",
    value: category.percentageProducts || 0,
    productCount: category.productCount || 0,
    variantCount: category.variantCount || 0,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm theo danh mục</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            Tổng sản phẩm active: {totalActiveProducts.toLocaleString()} | Variants: {totalActiveVariants.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Top 5 Categories Pie Chart */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Top 5 danh mục (tỷ lệ % sản phẩm)</span>
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
                `${value.toFixed(1)}% (${props.payload.productCount} sản phẩm, ${props.payload.variantCount} variants)`,
                `Danh mục: ${name}`,
              ]}
              labelFormatter={(label) => `Danh mục: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Full Categories Table (nếu có nhiều) */}
      {categories.length > 5 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Tất cả danh mục</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{category.productCount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{category.variantCount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{category.percentageProducts.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {chartData.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Không có dữ liệu danh mục</p>
      )}
    </div>
  );
};

export default ProductCategoryChart;