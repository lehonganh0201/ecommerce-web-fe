import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const getOrderRoute = async (orderId, originLat, originLng, vehicle = "car") => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/shipping/${orderId}/route`,
      params: {
        originLat,
        originLon: originLng,
        vehicle,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi ở lấy route đơn hàng:", error);
    throw new Error("Lấy route không thành công");
  }
};