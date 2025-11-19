// src/components/admin/dashboard/StatsCards.jsx
import React from "react";
import { Users, ShoppingCart, DollarSign, Star } from "lucide-react";

const StatsCards = ({ statsData }) => {
  const { activeRetention, conversionRate, averageCartStats, ratingStats } = statsData || {};

  const totalUsers = (activeRetention?.activeUsers ?? 0) + (activeRetention?.lockedUsers ?? 0);
  const totalOrders = conversionRate?.totalSuccessOrders ?? 0;
  const averageCartPrice = averageCartStats?.avgCartPrice ?? 0; 
  const totalRevenue = averageCartPrice * totalOrders; 
  const avgRating = ratingStats?.overallAvgRating ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            <p className="text-sm text-gray-500">Tổng người dùng</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-full bg-green-100">
            <ShoppingCart className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-full bg-yellow-100">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {totalRevenue.toLocaleString("vi-VN")} VNĐ
            </p>
            <p className="text-sm text-gray-500">Doanh thu</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-full bg-purple-100">
            <Star className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
            <p className="text-sm text-gray-500">Đánh giá trung bình</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;