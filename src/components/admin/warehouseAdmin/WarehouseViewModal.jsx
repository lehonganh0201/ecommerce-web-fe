// src/components/admin/warehouseAdmin/WarehouseViewModal.jsx
import React from "react";
import { X, Package } from "lucide-react";

const WarehouseViewModal = ({ warehouse, onClose, onEdit, onViewOrders }) => {
  if (!warehouse) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết kho</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên kho</label>
              <p className="text-gray-900">{warehouse.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <p className="text-gray-900">{warehouse.phoneNumber}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ đầy đủ</label>
              <p className="text-gray-900">{warehouse.fullAddress}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dung lượng tối đa</label>
              <p className="text-gray-900">{warehouse.maxCapacity}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dung lượng hiện tại</label>
              <p className="text-gray-900">{warehouse.currentCapacity}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sẵn có</label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  warehouse.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {warehouse.isAvailable ? "Có" : "Không"}
              </span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <p className="text-gray-900">{warehouse.description || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={() => onViewOrders(warehouse.id)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Package className="h-4 w-4 mr-2" />
            Xem đơn hàng
          </button>
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

export default WarehouseViewModal;