import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const createVariant = async (formData) => {
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/variants",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getVariantsByProductId = async (productId) => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: `/variants/product/${productId}`,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getProductByVariantId = async (variantId) => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: `/variants/${variantId}`,
    });
    return response.data;
  } catch (error) {
    console.log(`Error fetching product by variant ID ${variantId}:`, error);
    throw new Error(`Failed to fetch product by variant ID ${variantId}`);
  }
};

export const deleteVariantById = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/variants/${id}`,
    });
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateVariant = async (id, formData) => {
  try {
    const response = await request(axiosPrivate, {
      method: "PUT",
      url: `/variants/${id}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
