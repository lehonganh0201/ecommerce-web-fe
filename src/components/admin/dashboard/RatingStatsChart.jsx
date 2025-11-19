// src/components/admin/dashboard/RatingStatsChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Star } from "lucide-react";  // Icon cho ratings

const RatingStatsChart = ({ ratingStats }) => {
  const { overallAvgRating = 0, totalReviews = 0, highRatingPercentage = 0, breakdowns = [], level = "product" } = ratingStats || {};  // Safe unpack

  // Tính % cho progress bar
  const highRatingPercent = Math.round(highRatingPercentage);

  // Data cho BarChart (avgRating theo itemName)
  const chartData = breakdowns.map((breakdown) => ({
    itemName: breakdown.itemName || "Unknown",
    avgRating: breakdown.avgRating || 0,
    reviewCount: breakdown.reviewCount || 0,
    highRatingPercentage: breakdown.highRatingPercentage || 0,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê đánh giá</h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Level: {level.toUpperCase()} | Tổng đánh giá: {totalReviews.toLocaleString()}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Đánh giá trung bình</p>
            <p className="text-xl font-bold text-gray-900">{overallAvgRating.toFixed(1)} / 5</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tỷ lệ đánh giá cao (&ge;4 sao)</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{highRatingPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-yellow-600 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${highRatingPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdowns Bar Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="itemName" angle={-45} textAnchor="end" height={80} />
          <YAxis domain={[0, 5]} />
          <Tooltip
            formatter={(value, name, props) => [
              `${value.toFixed(1)} / 5 (${props.payload.reviewCount} đánh giá, ${(props.payload.highRatingPercentage).toFixed(1)}% cao)`,
              `${level === 'product' ? 'Sản phẩm' : 'Danh mục'}: ${name}`,
            ]}
          />
          <Legend />
          <Bar dataKey="avgRating" fill="#FFBB28" name="Đánh giá trung bình" />
        </BarChart>
      </ResponsiveContainer>

      {chartData.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Không có dữ liệu đánh giá</p>
      )}
    </div>
  );
};

export default RatingStatsChart;