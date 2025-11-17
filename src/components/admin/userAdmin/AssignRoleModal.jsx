// src/components/admin/userAdmin/AssignRoleModal.jsx (new modal for direct assign if needed)
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getAllRoles, assignRoleToUser } from "@/apis/role";
import { toast } from "react-hot-toast";

const AssignRoleModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    try {
      const res = await getAllRoles({ page: 0, size: 100 });
      setRoles(res.data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedRoleId) return;
    setLoading(true);
    try {
      await assignRoleToUser(selectedRoleId, userId);
      toast.success("Gán role thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Gán role thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Gán Role cho User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleAssign} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Role</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Chọn role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !selectedRoleId}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Đang gán..." : "Gán Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoleModal;