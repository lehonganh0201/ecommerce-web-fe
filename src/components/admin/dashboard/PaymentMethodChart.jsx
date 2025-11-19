// src/components/admin/dashboard/PaymentMethodChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ShoppingBag } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PaymentMethodChart = ({ paymentByMethod }) => {
  const { totalSuccessAmount = 0, methodStats = [] } = paymentByMethod || {};

  // Parse BigDecimal thành number
  const totalSuccess = parseFloat(totalSuccessAmount) || 0;

  // Data cho PieChart (sử dụng successRate % cho tỷ lệ)
  const chartData = methodStats.map((method, index) => ({
    name: method.methodName || "Unknown",
    value: method.successRate || 0,
    successAmount: parseFloat(method.successAmount) || 0,
    successCount: method.successCount || 0,
    totalPayments: method.totalPayments || 0,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Tỷ lệ thành công theo phương thức (Tổng thành công: {totalSuccess.toLocaleString("vi-VN")} VNĐ)</span>
        </div>
      </div>

      {/* Success Rate Pie Chart */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Tỷ lệ thành công (%)</span>
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
                `${value.toFixed(1)}% (${props.payload.successCount} thành công / ${props.payload.totalPayments} tổng)`,
                `Phương thức: ${name}`,
              ]}
              labelFormatter={(label) => `Phương thức: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Method Details Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Chi tiết phương thức</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng thanh toán</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành công</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền thành công</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {methodStats.map((method, index) => {
                const successAmt = parseFloat(method.successAmount) || 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{method.methodName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{method.totalPayments.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{method.successCount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{successAmt.toLocaleString("vi-VN")} VNĐ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{method.successRate.toFixed(1)}%</td>
                  </tr>
                );
              })}
              {methodStats.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Không có dữ liệu thanh toán</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodChart;