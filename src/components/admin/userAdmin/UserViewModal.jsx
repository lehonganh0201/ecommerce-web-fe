// src/components/admin/userAdmin/UserViewModal.jsx
import React from "react";
import { X, Download } from "lucide-react";

const UserViewModal = ({ user, onClose, onEdit, token }) => {
  if (!user) return null;

  const handleDownloadAvatar = () => {
    if (user.avatarUrl) {
      const link = document.createElement("a");
      link.href = user.avatarUrl;
      link.download = `avatar-${user.username}.jpg`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết người dùng</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={`${user.username}'s avatar`}
                className="h-24 w-24 rounded-full object-cover"
              />
              {user.avatar && (
                <button
                  onClick={handleDownloadAvatar}
                  className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-900"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Tải avatar
                </button>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <p className="text-gray-900">{user.fullName || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <p className="text-gray-900">{user.phoneNumber || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
              <p className="text-gray-900">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") : "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <p className="text-gray-900">{user.isMale ? "Nam" : user.isFemale ? "Nữ" : "Khác"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <p className="text-gray-900">{user.roleName || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kích hoạt</label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {user.enabled ? "Có" : "Không"}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Khóa</label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.locked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {user.locked ? "Khóa" : "Mở"}
              </span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số dư</label>
              <p className="text-2xl font-semibold text-gray-900">{user.balance?.toLocaleString("vi-VN")} VNĐ</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Sửa
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserViewModal;