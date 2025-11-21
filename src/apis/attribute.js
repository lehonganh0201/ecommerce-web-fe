import { request } from "@/utils/axios/axios-http";
import { axiosPublic } from "@/utils/axios/axiosInstance";

export const getDistinctAttributeNames = async (searchTerm = "") => {
  try {
    const params = searchTerm ? { name: searchTerm } : {};
    const response = await request(axiosPublic, {
      url: `/attributes/name`,
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách tên thuộc tính không thành công");
  }
};

export const getDistinctAttributeValuesByName = async (name) => {
  try {
    const response = await request(axiosPublic, {
      url: `/attributes/value`,
      method: "GET",
      params: { name },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách giá trị thuộc tính không thành công");
  }
};