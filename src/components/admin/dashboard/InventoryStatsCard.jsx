// src/components/admin/dashboard/InventoryStatsCard.jsx
import React from "react";
import { Package, AlertTriangle } from "lucide-react"; 

const InventoryStatsCard = ({ inventoryStats }) => {
  const { totalVariants = 0, totalStockQuantity = 0, outOfStockPercentage = 0, lowStockVariants = [], lowStockThreshold = 10 } = inventoryStats || {};

  // Tính % cho progress bar
  const outOfStockPercent = Math.round(outOfStockPercentage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê kho hàng</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            Ngưỡng low stock: {lowStockThreshold} | Tổng variants: {totalVariants.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Out-of-Stock Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Tỷ lệ hết hàng</span>
          <span className={`text-sm font-medium ${outOfStockPercent > 20 ? 'text-red-600' : 'text-green-600'}`}>
            {outOfStockPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${outOfStockPercent > 20 ? 'bg-red-600' : 'bg-green-600'}`}
            style={{ width: `${outOfStockPercent}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Tổng số lượng stock: {totalStockQuantity.toLocaleString()}</p>
      </div>

      {/* Low Stock Variants Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-medium text-gray-700">Sản phẩm low stock (dưới {lowStockThreshold})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockVariants.map((variant, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.productName}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${variant.stockQuantity <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {variant.stockQuantity}
                  </td>
                </tr>
              ))}
              {lowStockVariants.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Không có sản phẩm low stock</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatsCard;