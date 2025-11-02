import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const getCategories = async (data) => {
  try {
    const { sortedBy, sortDirection, page, size, searchKeyword } = data;

    const response = await request(axiosPublic, {
      url: `/categories?${
        sortedBy ? `sortedBy=${sortedBy}` : ""
      }&sortDirection=${sortDirection ? sortDirection : "asc"}&page=${
        page ? page : "0"
      }&size=${size ? size : "10"}${
        searchKeyword ? `&searchKeyword=${searchKeyword}` : ""
      }`,
      method: "GET",
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách danh mục không thành công");
  }
};

export const uploadImageCategory = async (categoryId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await request(axiosPrivate, {
      method: "PUT",
      url: `/categories/${categoryId}/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Upload image error:", error.response?.data);
    throw error;
  }
};

export const createCategory = async (formData) => {
  try {
    const res = await request(axiosPrivate, {
      method: "POST",
      url: `/categories`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create category error:", error.response?.data);
    throw error;
  }
};

export const editCategory = async (categoryId, formData) => {
  try {
    const res = await request(axiosPrivate, {
      method: "PUT",
      url: `/categories/${categoryId}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Edit category error:", error.response?.data);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const res = await request(axiosPrivate, {
      method: "DELETE",
      url: `/categories/${categoryId}`,
    });
    return res;
  } catch (error) {
    console.error("Delete category error:", error.response?.data);
    throw error;
  }
};
