// src/apis/stats.js
import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

export const getUsersByRole = async (fromDate, toDate) => {
  try {
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/users/roles",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy stats user by role:", error);
    throw new Error("Lấy stats user by role không thành công");
  }
};

export const getDemographics = async (fromDate, toDate, limit = 5) => {
  try {
    const params = { limit };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/users/demographics",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy demographics:", error);
    throw new Error("Lấy demographics không thành công");
  }
};

export const getActiveRetention = async (fromDate, toDate) => {
  try {
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/users/active-retention",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy active retention:", error);
    throw new Error("Lấy active retention không thành công");
  }
};

export const getProductsByCategory = async (fromDate, toDate) => {
  try {
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/products/categories",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy products by category:", error);
    throw new Error("Lấy products by category không thành công");
  }
};

export const getInventoryStats = async (fromDate, toDate, threshold = 10) => {
  try {
    const params = { threshold };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/products/inventory",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy inventory stats:", error);
    throw new Error("Lấy inventory stats không thành công");
  }
};

export const getTopAttributes = async (fromDate, toDate, topN = 5) => {
  try {
    const params = { topN };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/products/attributes",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy top attributes:", error);
    throw new Error("Lấy top attributes không thành công");
  }
};

export const getProductImagesStats = async (fromDate, toDate, includePerProduct = false) => {
  try {
    const params = { includePerProduct };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/products/images",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy product images stats:", error);
    throw new Error("Lấy product images stats không thành công");
  }
};

export const getAverageCartStats = async (fromDate, toDate, topN = 5) => {
  try {
    const params = { topN };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/carts/average",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy average cart stats:", error);
    throw new Error("Lấy average cart stats không thành công");
  }
};

export const getConversionRate = async (fromDate, toDate, status = "DELIVERED", includeDetails = false) => {
  try {
    const params = { status, includeDetails };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/orders/conversion-rate",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy conversion rate:", error);
    throw new Error("Lấy conversion rate không thành công");
  }
};

export const getRevenueByTime = async (fromDate, toDate, status = "DELIVERED") => {
  try {
    const params = { status };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/orders/revenue",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy revenue by time:", error);
    throw new Error("Lấy revenue by time không thành công");
  }
};

export const getBestSellingVariants = async (fromDate, toDate, status = "DELIVERED", topN = 5) => {
  try {
    const params = { status, topN };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/orders/best-seller",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy best selling variants:", error);
    throw new Error("Lấy best selling variants không thành công");
  }
};

export const getOrdersByRegion = async (fromDate, toDate, status = "DELIVERED", level = "CITY") => {
  try {
    const params = { status, level };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/orders/regions",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy orders by region:", error);
    throw new Error("Lấy orders by region không thành công");
  }
};

export const getPaymentByMethod = async (fromDate, toDate) => {
  try {
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/payments/methods",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy payment by method:", error);
    throw new Error("Lấy payment by method không thành công");
  }
};

export const getRatingStats = async (fromDate, toDate, level = "product") => {
  try {
    const params = { level };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const response = await request(axiosPrivate, {
      url: "/stats/reviews/ratings",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy rating stats:", error);
    throw new Error("Lấy rating stats không thành công");
  }
};