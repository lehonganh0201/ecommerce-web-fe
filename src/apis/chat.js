import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const fetchChatHistory = async (page = 0, size = 10) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/messages/history?page=${page}&size=${size}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Fetch chat history failed:", error);
    throw new Error("Không thể tải lịch sử chat");
  }
};