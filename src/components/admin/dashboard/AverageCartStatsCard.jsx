// src/components/admin/dashboard/AverageCartStatsCard.jsx
import React from "react";
import { ShoppingCart, DollarSign } from "lucide-react";

const AverageCartStatsCard = ({ averageCartStats }) => {
  const { avgCartPrice = 0, totalCartValue = 0, totalCarts = 0, topVariantsInCarts = [], topN = 5 } = averageCartStats || {}; 

  const avgPrice = parseFloat(avgCartPrice) || 0;
  const totalValue = parseFloat(totalCartValue) || 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê giỏ hàng trung bình</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Top {topN} variants phổ biến</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{avgPrice.toLocaleString("vi-VN")} VNĐ</p>
          <p className="text-xs text-gray-500">Giá trung bình/giỏ</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{totalValue.toLocaleString("vi-VN")} VNĐ</p>
          <p className="text-xs text-gray-500">Tổng giá trị giỏ</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{totalCarts.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Tổng giỏ hàng</p>
        </div>
      </div>

      {/* Top Variants Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Top variants trong giỏ</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU Variant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng số lượng</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng giá trị</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topVariantsInCarts.map((variant, index) => {
                const variantValue = parseFloat(variant.totalValue) || 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.variantSku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{variant.totalQuantity.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{variantValue.toLocaleString("vi-VN")} VNĐ</td>
                  </tr>
                );
              })}
              {topVariantsInCarts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Không có dữ liệu variants</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AverageCartStatsCard;