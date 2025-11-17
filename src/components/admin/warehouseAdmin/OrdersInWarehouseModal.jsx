// src/components/admin/warehouseAdmin/OrdersInWarehouseModal.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getOrdersInWarehouse } from "@/apis/warehouse";

const OrdersInWarehouseModal = ({ warehouseId, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [warehouseId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrdersInWarehouse(warehouseId, { page: 0, size: 20, sort: "createdAt", direction: "DESC" });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!warehouseId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Đơn hàng trong kho</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <p>Đang tải đơn hàng...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderCode}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.fullName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.totalAmount?.toLocaleString("vi-VN")} VNĐ</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="text-center text-gray-500 py-4">Không có đơn hàng nào.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersInWarehouseModal;