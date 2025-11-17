// src/components/admin/userAdmin/DeleteUserModal.jsx
import React from "react";
import { X, Trash2 } from "lucide-react";

const DeleteUserModal = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Xóa người dùng</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa người dùng <span className="font-medium">{user.username}</span>? Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;