// src/components/admin/userAdmin/ChangePasswordModal.jsx
import React, { useState } from "react";
import { X, Key } from "lucide-react";
import toast from "react-hot-toast";

const ChangePasswordModal = ({ isOpen, onClose, onSubmit, userId }) => {
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    onSubmit(passwordData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Key className="h-5 w-5 mr-2 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">Đổi mật khẩu</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;