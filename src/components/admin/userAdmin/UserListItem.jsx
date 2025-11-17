// src/components/admin/userAdmin/UserListItem.jsx (updated to receive refresh prop)
import React from "react";
import { Eye, Edit, Trash2, Lock, Unlock, Key, UserCog } from "lucide-react";
import AssignRoleModal from "./AssignRoleModal";

const UserListItem = ({ user, onView, onEdit, onDelete, onToggleLock, onChangePassword, onRefreshUsers }) => {
  const [showAssignModal, setShowAssignModal] = React.useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {user.id}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.username}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate">
          {user.email}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.phoneNumber}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.roleName}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.enabled
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.enabled ? "Có" : "Không"}
          </span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.locked
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {user.locked ? "Khóa" : "Mở"}
          </span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500">
          {user.balance?.toLocaleString("vi-VN")} VNĐ
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onView(user)}
              className="text-blue-600 hover:text-blue-900 p-1"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(user)}
              className="text-orange-600 hover:text-orange-900 p-1"
              title="Sửa"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="text-indigo-600 hover:text-indigo-900 p-1"
              title="Gán Role"
            >
              <UserCog className="h-4 w-4" />
            </button>
            <button
              onClick={() => onToggleLock(user)}
              className={`p-1 ${
                user.locked
                  ? "text-green-600 hover:text-green-900"
                  : "text-red-600 hover:text-red-900"
              }`}
              title={user.locked ? "Mở khóa" : "Khóa"}
            >
              {user.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onChangePassword(user)}
              className="text-purple-600 hover:text-purple-900 p-1"
              title="Đổi mật khẩu"
            >
              <Key className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(user)}
              className="text-red-600 hover:text-red-900 p-1"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      {showAssignModal && (
        <AssignRoleModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          userId={user.id}
          onSuccess={() => {
            onRefreshUsers();
          }}
        />
      )}
    </>
  );
};

export default UserListItem;