// src/apis/warehouse.js
import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const getAllWarehouses = async (params = {}) => {
  try {
    const response = await request(axiosPrivate, {
      url: "/warehouses",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách kho:", error);
    throw new Error("Lấy danh sách kho không thành công");
  }
};

export const getWarehouseById = async (warehouseId) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/warehouses/${warehouseId}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin kho:", error);
    throw new Error("Lấy thông tin kho không thành công");
  }
};

export const getOrdersInWarehouse = async (warehouseId, params = {}) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/warehouses/${warehouseId}/orders`,
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng trong kho:", error);
    throw new Error("Lấy đơn hàng trong kho không thành công");
  }
};

export const createWarehouse = async (warehouseData) => {
  try {
    const response = await request(axiosPrivate, {
      url: "/warehouses",
      method: "POST",
      data: warehouseData,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo kho:", error);
    throw new Error("Tạo kho không thành công");
  }
};

export const updateWarehouse = async (warehouseId, warehouseData) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/warehouses/${warehouseId}`,
      method: "PUT",
      data: warehouseData,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật kho:", error);
    throw new Error("Cập nhật kho không thành công");
  }
};

export const deleteWarehouse = async (warehouseId) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/warehouses/${warehouseId}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa kho:", error);
    throw new Error("Xóa kho không thành công");
  }
};