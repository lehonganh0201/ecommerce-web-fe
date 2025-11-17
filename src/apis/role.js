// src/apis/role.js
import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const getAllRoles = async (params = {}) => {
  try {
    const response = await request(axiosPrivate, {
      url: "/roles",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách roles:", error);
    throw new Error("Lấy danh sách roles không thành công");
  }
};

export const assignRoleToUser = async (roleId, userId) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/roles/${roleId}/assign/${userId}`,
      method: "POST",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gán role cho user:", error);
    throw new Error("Gán role cho user không thành công");
  }
};