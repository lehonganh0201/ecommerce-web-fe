// src/components/admin/userAdmin/UserFormModal.jsx (updated with real role fetch)
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getAllRoles } from "@/apis/role";

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, formType }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    isMale: true,
    roleId: "",
    enabled: true,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split("T")[0] : "",
        isMale: initialData.isMale || true,
        roleId: initialData.roleId || "",
        enabled: initialData.enabled !== undefined ? initialData.enabled : true,
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await getAllRoles({ page: 0, size: 100 });
      setRoles(res.data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, avatarFile);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {formType === "edit" ? "Sửa người dùng" : "Thêm người dùng"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
            <select
              value={formData.isMale ? "male" : "female"}
              onChange={(e) => setFormData({ ...formData, isMale: e.target.value === "male" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              disabled={loadingRoles}
            >
              <option value="">Chọn vai trò</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {loadingRoles && <p className="text-sm text-gray-500 mt-1">Đang tải roles...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kích hoạt</label>
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;