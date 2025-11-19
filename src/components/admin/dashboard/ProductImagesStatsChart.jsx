// src/components/admin/dashboard/ProductImagesStatsChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Image, Calendar } from "lucide-react";  // Icons cho images

const ProductImagesStatsChart = ({ productImagesStats }) => {
  const { avgImagesPerProduct = 0, minImagesPerProduct = 0, maxImagesPerProduct = 0, uploadStatsByTime = [], productImageCounts = [] } = productImagesStats || {};  // Safe unpack

  // Data cho LineChart (uploads theo period)
  const chartData = uploadStatsByTime.map(stat => ({
    period: stat.period || "N/A",
    count: stat.count || 0,
  }));

  // Kiểm tra nếu có per-product data (từ param includePerProduct=true)
  const hasPerProduct = productImageCounts?.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê hình ảnh sản phẩm</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Trung bình: {avgImagesPerProduct.toFixed(1)} ảnh/sản phẩm</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{minImagesPerProduct}</p>
          <p className="text-xs text-gray-500">Tối thiểu</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{avgImagesPerProduct.toFixed(1)}</p>
          <p className="text-xs text-gray-500">Trung bình</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{maxImagesPerProduct}</p>
          <p className="text-xs text-gray-500">Tối đa</p>
        </div>
      </div>

      {/* Upload Stats Line Chart */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Uploads theo thời gian</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} ảnh`, "Số lượng uploads"]} />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#0088FE" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Product Table (nếu có) */}
      {hasPerProduct && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Chi tiết theo sản phẩm</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số ảnh</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productImageCounts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.productId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.imageCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {chartData.length === 0 && !hasPerProduct && (
        <p className="text-center text-gray-500 mt-4">Không có dữ liệu hình ảnh</p>
      )}
    </div>
  );
};

export default ProductImagesStatsChart;