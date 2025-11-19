// src/components/admin/dashboard/UserDemographicsChart.jsx
import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, MapPin, Calendar } from "lucide-react"; 

const GENDER_COLORS = ["#0088FE", "#FF8042", "#FF6384"];
const AGE_COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#9966FF"]; 

const UserDemographicsChart = ({ demographics }) => {
  const { totalUsers = 0, gender = {}, ageGroups = [], topCities = [] } = demographics || {};

  const genderData = [
    { name: "Nam", value: gender.male || 0, fill: GENDER_COLORS[0] },
    { name: "Nữ", value: gender.female || 0, fill: GENDER_COLORS[1] },
    ...(gender.other > 0 ? [{ name: "Khác", value: gender.other, fill: GENDER_COLORS[2] }] : []),
  ].filter(item => item.value > 0);

  const ageData = ageGroups.map(group => ({
    group: group.group || "Unknown",
    count: group.count || 0,
  }));

  const citiesData = topCities.slice(0, 5); 

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhân khẩu học người dùng</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Tổng: {totalUsers.toLocaleString()} người dùng</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Phân bổ theo giới tính</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              nameKey="name"
            >
              {genderData.map((entry, index) => (
                <Cell key={`gender-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} người`, "Giới tính"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Phân bổ theo nhóm tuổi</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ageData}>
            <XAxis dataKey="group" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} người`, "Số lượng"]} />
            <Legend />
            <Bar dataKey="count" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Top thành phố (Top 5)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành phố</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {citiesData.map((city, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{city.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{city.count.toLocaleString()}</td>
                </tr>
              ))}
              {citiesData.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-gray-500">Không có dữ liệu thành phố</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDemographicsChart;