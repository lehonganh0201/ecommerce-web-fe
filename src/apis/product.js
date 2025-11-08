import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const getProducts = async (data) => {
  try {
    const {
      page,
      size,
      keyword,
      inStock,
      categoryId,
      minPrice,
      maxPrice,
      minVariantPrice,
      maxVariantPrice,
      color,
      sortedBy,
      sortDirection,
      status,
    } = data;
    const response = await request(axiosPublic, {
      method: "GET",
      url: "/products",
      params: {
        page,
        size,
        keyword,
        inStock,
        categoryId,
        minPrice,
        maxPrice,
        minVariantPrice,
        maxVariantPrice,
        color,
        sortedBy,
        sortDirection,
        status,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/products/${id}`,
    });
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateStatusProduct = async (id, status) => {
  try {
    const response = await request(axiosPrivate, {
      methoad: "PUT",
      url: "/products/status",
      data: { id, status },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/products",
      data: formData,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await request(axiosPrivate, {
      method: "PUT",
      url: `/products/${id}`,
      data: formData,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getProductByProductId = async (id) => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",

      url: `/products/${id}`,
    });
    return response.data;
  } catch (err) {
    console.log(err);

    throw err;
  }
};
