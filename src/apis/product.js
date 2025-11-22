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

export const getAllProducts = async (data) => {
  try {
    const {
      sortedBy,
      sortDirection,
      page,
      size,
      searchKeyword,
      categoryName,
      minPrice,
      maxPrice,
      status,
    } = data;
    const response = await request(axiosPublic, {
      url: `/products?${sortedBy ? `sortedBy=${sortedBy}` : ""}&sortDirection=${
        sortDirection ? sortDirection : "asc"
      }&page=${page ? page : "0"}&size=${size ? size : "10"}${
        searchKeyword ? `&searchKeyword=${searchKeyword}` : ""
      }${categoryName ? `&categoryName=${categoryName}` : ""}${
        minPrice ? `&minPrice=${minPrice}` : ""
      }${maxPrice ? `&maxPrice=${maxPrice}` : ""}&status=${
        status ? status : "true"
      }`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách sản phẩm không thành công");
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
      method: "PUT",
      url: "/products/status",
      data: { id, status },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/products",
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

export const updateProduct = async (id, formData) => {
  try {
    const response = await request(axiosPrivate, {
      method: "PUT",
      url: `/products/${id}`,
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

export const getProductByProductId = async (id) => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: `/products/${id}`,
    });
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/products/${productId}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy thông tin sản phẩm không thành công");
  }
};

export const searchProducts = async (keyword) => {
  try {
    const response = await request(axiosPublic, {
      url: `/products?keyword=${keyword}`,
      method: "GET",
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Tìm kiếm sản phẩm không thành công");
  }
};
