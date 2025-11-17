// src/components/admin/warehouseAdmin/WarehouseListItem.jsx
import React from "react";
import { Eye, Edit, Trash2, Package } from "lucide-react";

const WarehouseListItem = ({ warehouse, onView, onEdit, onDelete, onViewOrders }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {warehouse.id}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {warehouse.name}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px] truncate">
        {warehouse.fullAddress}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {warehouse.maxCapacity}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            warehouse.available
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {warehouse.available ? "Có" : "Không"}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            warehouse.status === "OPEN"
              ? "bg-green-100 text-green-800"
              : warehouse.status === "CLOSED"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {warehouse.status}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onViewOrders(warehouse.id)}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="Xem đơn hàng"
          >
            <Package className="h-4 w-4" />
          </button>
          <button
            onClick={() => onView(warehouse)}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(warehouse)}
            className="text-orange-600 hover:text-orange-900 p-1"
            title="Sửa"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(warehouse)}
            className="text-red-600 hover:text-red-900 p-1"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default WarehouseListItem;