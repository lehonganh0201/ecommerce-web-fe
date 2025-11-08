/* eslint-disable*/
import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const addToCart = async (data) => {
  try {
    const { variantId, quantity } = data;
    const response = await request(axiosPrivate, {
      url: "/carts",
      method: "POST",
      data: {
        variantId,
        quantity,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductsInCart = async () => {
  try {
    const response = await request(axiosPrivate, {
      url: "/carts",
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách sản phẩm trong giỏ hàng không thành công");
  }
};

export const deleteAllProductsInCart = async () => {
  try {
    const response = await request(axiosPrivate, {
      url: "/carts",
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Xoá tất cả sản phẩm trong giỏ hàng không thành công");
  }
};

export const deleteProductInCart = async (variantId) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/carts/${variantId}`,
      method: "POST",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Xoá sản phẩm trong giỏ hàng không thành công");
  }
};

export const updateProductInCart = async (data) => {
  try {
    const { variantId, quantity } = data;
    const response = await request(axiosPrivate, {
      url: `/carts/${variantId}?quantity=${quantity}`,
      method: "PUT",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Cập nhật sản phẩm trong giỏ hàng không thành công");
  }
};
