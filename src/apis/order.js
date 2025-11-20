import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const createdOrder = async (data) => {
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/orders",
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi ở đặt hàng:", error);
    throw new Error("Đặt hàng không thành công");
  }
};

export const getOrderByOrderType = async (orderType, paginationParams = {}) => {
  try {
    const statusMap = {
      PENDING: "PROCESSING",
      SHIPPED: "DELIVERED",
      CANCELED: "CANCELED",
    };
    const status = orderType ? statusMap[orderType] || orderType : null;

    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/orders/me",
      params: {
        status,
        ...paginationParams,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi ở lấy đơn hàng:", error);
    throw new Error("Lấy đơn hàng không thành công");
  }
};

export const getConfirmedOrder = async (params) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/orders/confirm?${params}`,
    });

    return response.data;
  } catch (error) {
    console.log("Error fetching confirmed orders:", error);
    throw new Error("Lấy đơn hàng đã xác nhận không thành công");
  }
};

export const getReferenceOrder = async (reference) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/orders/me?orderCode=${reference}`,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi ở lấy đơn hàng theo mã tham chiếu:", error);
    throw new Error("Lấy đơn hàng theo mã tham chiếu không thành công");
  }
};

export const getOrders = async (data) => {
  try {
    const {
      page,
      size,
      sortedBy,
      sortDirection,
      status,
      minTotal,
      maxTotal,
      startDate,
      endDate,
    } = data;
    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/orders",
      params: {
        page,
        size,
        sortedBy,
        sortDirection,
        status,
        minTotal,
        maxTotal,
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi ở lấy đơn hàng:", error);
    throw new Error("Lấy đơn hàng không thành công");
  }
};

export const updateStatus = async (data) => {
  try {
    const { status, orderId } = data;
    await request(axiosPrivate, {
      method: "PUT",
      url: `/orders/${orderId}?status=${status}`,
    });
  } catch (error) {
    console.error("Lỗi ở cập nhật trạng thái:", error);
    throw new Error("Cập nhật trạng thái không thành công");
  }
};

export const ORDER_STATUS_MAP = {
  PENDING: {
    label: "Chờ xác nhận",
    description: "Đơn hàng mới được đặt, đang chờ xác nhận hoặc xử lý ban đầu (ví dụ: chờ thanh toán hoặc kiểm tra thông tin). Đây là trạng thái khởi đầu.",
    color: "bg-yellow-500 text-white", // Màu vàng cho chờ đợi
    filterKey: "PENDING", // Dùng cho filter UI
  },
  PROCESSING: {
    label: "Đang xử lý",
    description: "Đơn hàng đang được xử lý nội bộ, như kiểm tra kho hàng, chuẩn bị đóng gói, hoặc xác nhận thanh toán. Chưa sẵn sàng giao.",
    color: "bg-blue-500 text-white", // Màu xanh dương cho xử lý
    filterKey: "PROCESSING",
  },
  SHIPPED: {
    label: "Đã gửi hàng",
    description: "Đơn hàng đã được đóng gói và gửi đi (shipped), đang trên đường vận chuyển đến khách hàng. Có thể kèm theo mã theo dõi.",
    color: "bg-green-500 text-white", // Màu xanh lá cho đang giao
    filterKey: "SHIPPED",
  },
  DELIVERED: {
    label: "Đã giao",
    description: "Đơn hàng đã được giao thành công đến tay khách hàng. Quy trình hoàn tất, có thể chuyển sang theo dõi đánh giá hoặc hoàn tiền nếu cần.",
    color: "bg-green-700 text-white", // Màu xanh đậm cho hoàn tất
    filterKey: "SHIPPED", // Group vào "Đã giao hàng" trong filter
  },
  PENDING_ASSIGNMENT: {
    label: "Chờ phân công",
    description: "Đơn hàng đang chờ phân công (assignment), thường dùng trong hệ thống giao hàng (ví dụ: chờ gán tài xế, kho hàng hoặc nhân viên xử lý). Đây là trạng thái trung gian giữa xử lý và giao.",
    color: "bg-orange-500 text-white", // Màu cam cho chờ phân công
    filterKey: "PENDING", // Group vào "Đang giao hàng" hoặc riêng nếu cần
  },
  CANCELLED: {
    label: "Đã hủy",
    description: "Đơn hàng bị hủy, có thể do khách hàng yêu cầu, hết hàng, lỗi thanh toán hoặc lý do khác. Không tiếp tục xử lý.",
    color: "bg-red-500 text-white", // Màu đỏ cho hủy
    filterKey: "CANCELED",
  },
};

export const getOrderStatusInfo = (status) => {
  return ORDER_STATUS_MAP[status] || {
    label: "Không xác định",
    description: "Trạng thái đơn hàng không hợp lệ.",
    color: "bg-gray-500 text-white",
  };
};