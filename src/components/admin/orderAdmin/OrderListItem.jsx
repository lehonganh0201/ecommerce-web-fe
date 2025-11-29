import { Eye, MapPin } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import OrderStatusBadge from "./OrderStatusBadge";
import { updateStatus } from "@/apis/order";

const OrderListItem = ({ order, onView, onStatusChange, onNavigate }) => {
  const itemsCount = order.orderItems.length;
  const [status, setStatus] = useState(order.status);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime + "Z");
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const vnTime = new Date(utc + 7 * 60 * 60 * 1000);

    const day = String(vnTime.getDate()).padStart(2, "0");
    const month = String(vnTime.getMonth() + 1).padStart(2, "0");
    const year = vnTime.getFullYear();
    const hours = String(vnTime.getHours()).padStart(2, "0");

    const minutes = String(vnTime.getMinutes()).padStart(2, "0");
    const seconds = String(vnTime.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const data = {
        orderId: order.id,
        status: newStatus,
      };
      await updateStatus(data);
      setStatus(newStatus);
      toast.success("Cập nhật trạng thái thành công");
      onStatusChange();
    } catch {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <Motion.tr
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover:bg-gray-50"
    >
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{order.orderCode}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-gray-900">{itemsCount} sản phẩm</div>
        <div className="text-xs text-gray-500">
          {order.orderItems
            .slice(0, 2)
            .map((item) => item?.name)}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDateTime(order.createdAt)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {order.totalAmount}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <OrderStatusBadge
          value={status}
          onChange={handleStatusChange}
          useFixedMenu
        />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onView(order)}
            className="cursor-pointer text-blue-600 hover:text-blue-900"
            title="Xem chi tiết đơn hàng"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onNavigate(order)}
            className="cursor-pointer text-green-600 hover:text-green-900"
            title="Chỉ đường đến địa chỉ giao hàng"
          >
            <MapPin className="h-4 w-4" />
          </button>
        </div>
      </td>
    </Motion.tr>
  );
};

export default OrderListItem;