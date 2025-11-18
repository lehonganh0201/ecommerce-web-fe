// src/components/admin/dashboard/BestSellerTable.jsx
import React from "react";
import { TrendingUp, ShoppingCart } from "lucide-react";

const BestSellerTable = ({ bestSellingVariants }) => {
  const { totalRevenue = 0, topVariants = [], topNPercentage = 0, topN = 5 } = bestSellingVariants || {};

  // Parse BigDecimal thành number
  const totalRev = parseFloat(totalRevenue) || 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy nhất</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Status: DELIVERED | Top {topN}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng doanh thu top {topN}</p>
            <p className="text-xl font-bold text-gray-900">{totalRev.toLocaleString("vi-VN")} VNĐ</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Tỷ lệ % doanh thu</p>
            <p className="text-xl font-bold text-green-600">{topNPercentage.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Top Variants Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU Variant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng bán</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ %</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topVariants.map((variant, index) => {
              const variantRev = parseFloat(variant.totalRevenue) || 0;
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variant.variantSku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{variant.totalQuantity.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{variantRev.toLocaleString("vi-VN")} VNĐ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{variant.percentage.toFixed(1)}%</td>
                </tr>
              );
            })}
            {topVariants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Không có dữ liệu bán chạy</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BestSellerTable;