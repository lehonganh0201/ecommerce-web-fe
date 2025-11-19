// src/components/admin/dashboard/ActiveRetentionChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, Zap } from "lucide-react"; 

const ActiveRetentionChart = ({ activeRetention }) => {
  const { period = "N/A", totalUsers = 0, newUsers = 0, activeUsers = 0, lockedUsers = 0, retentionRate = 0 } = activeRetention || {};  // Safe unpack

  const chartData = [
    { name: "Người dùng mới", value: newUsers, fill: "#00C49F" },
    { name: "Người dùng active", value: activeUsers, fill: "#0088FE" },
    { name: "Người dùng locked", value: lockedUsers, fill: "#FF8042" },
  ];

  // Tính % cho progress bar
  const retentionPercent = Math.round(retentionRate); 

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Giữ chân người dùng (Retention)</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            Thời gian: {period} | Tổng: {totalUsers.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Retention Rate Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Tỷ lệ giữ chân</span>
          <span className="text-sm font-medium text-green-600">{retentionPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${retentionPercent}%` }}
          ></div>
        </div>
      </div>

      {/* User Breakdown Bar Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} người`, "Số lượng"]} />
          <Legend />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>

      {totalUsers === 0 && (
        <p className="text-center text-gray-500 mt-4">Không có dữ liệu retention</p>
      )}
    </div>
  );
};

export default ActiveRetentionChart;