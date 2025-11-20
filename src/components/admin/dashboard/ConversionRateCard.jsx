// src/components/admin/dashboard/ConversionRateCard.jsx
import React from "react";
import { ShoppingCart, TrendingUp } from "lucide-react";

const ConversionRateCard = ({ conversionRate }) => {
  const { totalCarts = 0, convertedCarts = 0, totalSuccessOrders = 0, conversionRate: rate = 0, details = [] } = conversionRate || {};

  // Tính % cho progress bar
  const conversionPercent = Math.round(rate);

  // Kiểm tra nếu có per-user details (từ param includeDetails=true)
  const hasDetails = details.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tỷ lệ chuyển đổi đơn hàng</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Status: DELIVERED</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Tổng giỏ hàng</p>
          <p className="text-2xl font-bold text-gray-900">{totalCarts.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Giỏ chuyển đổi thành công</p>
          <p className="text-2xl font-bold text-green-600">{convertedCarts.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Tổng đơn thành công</p>
          <p className="text-2xl font-bold text-blue-600">{totalSuccessOrders.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Tỷ lệ chuyển đổi</p>
          <p className="text-2xl font-bold text-purple-600">{conversionPercent}%</p>
        </div>
      </div>

      {/* Conversion Rate Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Tỷ lệ chuyển đổi</span>
          <span className={`text-sm font-medium ${conversionPercent > 50 ? 'text-green-600' : 'text-yellow-600'}`}>
            {conversionPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${conversionPercent > 50 ? 'bg-green-600' : 'bg-yellow-600'}`}
            style={{ width: `${conversionPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Per-User Details Table */}
      {hasDetails && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Chi tiết theo user</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số giỏ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {details.map((detail, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.cartsCount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.ordersCount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{(detail.userConversionRate * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalCarts === 0 && !hasDetails && (
        <p className="text-center text-gray-500 mt-4">Không có dữ liệu chuyển đổi</p>
      )}
    </div>
  );
};

export default ConversionRateCard;