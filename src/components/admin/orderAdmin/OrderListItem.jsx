import { Eye } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import OrderStatusBadge from "./OrderStatusBadge";
const OrderListItem = ({ order, onView, token, onStatusChange }) => {
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
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${
          order.id
        }?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      // whileHover={{ scale: 1.02 }}
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
            .map((item) => item?.name)
            .join(", ")}
          {itemsCount > 2 ? `, +${itemsCount - 2} more` : ""}
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
        <button
          onClick={() => onView(order)}
          className="cursor-pointer text-blue-600 hover:text-blue-900"
          title="View Order Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      </td>
    </Motion.tr>
  );
};

export default OrderListItem;
