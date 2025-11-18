// src/components/admin/dashboard/RoleStatsChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users } from "lucide-react";  // Icon users cho roles

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

const RoleStatsChart = ({ usersByRole }) => {
  const { totalUsers = 0, roles = [] } = usersByRole || {};

  const chartData = roles.map((role, index) => ({
    name: role.name || "Unknown",
    value: role.percentage || 0,
    count: role.count || 0,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê người dùng theo vai trò</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            Tỷ lệ phân bổ roles (Tổng: {totalUsers.toLocaleString()})
          </span>
        </div>
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
              `${value.toFixed(1)}% (${props.payload.count} users)`,
              `Vai trò: ${name}`,
            ]}
            labelFormatter={(label) => `Vai trò: ${label}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      {chartData.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Không có dữ liệu roles</p>
      )}
    </div>
  );
};

export default RoleStatsChart;