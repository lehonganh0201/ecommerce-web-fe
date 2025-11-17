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

export const getOrderByOrderType = async (orderType) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/orders${orderType && `?orderType=${orderType}`}`,
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
