// src/components/admin/dashboard/RevenueChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";

const RevenueChart = ({ revenueByTime }) => {
  const { totalRevenue = 0, monthlyRevenues = [], currentMonthKpi = {} } = revenueByTime || {};

  // Parse BigDecimal thành number
  const totalRev = parseFloat(totalRevenue) || 0;
  const currentRev = parseFloat(currentMonthKpi.revenue) || 0;
  const currentOrders = currentMonthKpi.orderCount || 0;
  const currentPeriod = currentMonthKpi.period || "N/A";

  // Data cho LineChart (monthly revenue)
  const chartData = monthlyRevenues.map(month => ({
    period: month.period || "N/A",
    revenue: parseFloat(month.revenue) || 0,
    orderCount: month.orderCount || 0,
  }));

  const customTooltipFormatter = (value, name, props) => {
    if (props.dataKey === 'revenue' || name === 'Doanh thu') {
      return [`${value.toLocaleString("vi-VN")} VNĐ`, "Doanh thu"];
    } else if (props.dataKey === 'orderCount' || name === 'Số đơn') {
      return [`${value.toLocaleString("vi-VN")}`, "Số đơn"];
    }
    return [value, name];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo thời gian</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Status: DELIVERED</span>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Tổng doanh thu</p>
            <p className="text-xl font-bold text-gray-900">{totalRev.toLocaleString("vi-VN")} VNĐ</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tháng hiện tại ({currentPeriod})</p>
            <p className="text-xl font-bold text-green-600">{currentRev.toLocaleString("vi-VN")} VNĐ ({currentOrders} đơn)</p>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Line Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          
          <YAxis 
            yAxisId="left" 
            tickFormatter={(value) => `${value.toLocaleString("vi-VN")} VNĐ`}
            stroke="#0088FE"
          />
          
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#FF8042"
            tickFormatter={(value) => value.toLocaleString("vi-VN")}
          />
          
          <Tooltip 
            formatter={customTooltipFormatter}
            labelFormatter={(label) => `Tháng: ${label}`}
          />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#0088FE" name="Doanh thu" yAxisId="left" />
          <Line type="monotone" dataKey="orderCount" stroke="#FF8042" name="Số đơn" yAxisId="right" />
        </LineChart>
      </ResponsiveContainer>

      {chartData.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Không có dữ liệu doanh thu</p>
      )}
    </div>
  );
};

export default RevenueChart;