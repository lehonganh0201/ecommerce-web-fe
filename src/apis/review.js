import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const getReviewsByProductId = async (data) => {
  try {
    const { productId, page, size, sort, direction, minRating, maxRating } =
      data;
    const response = await request(axiosPrivate, {
      url: `/reviews/product/${productId}?page=${page ?? "0"}&size=${
        size ?? "20"
      }${sort ? `&sort=${sort}` : ""}&direction=${direction ?? "desc"}${
        minRating ? `&minRating=${minRating}` : ""
      }${maxRating ? `&maxRating=${maxRating}` : ""}`,

      method: "GET",
    });
    console.log("response review", response);
    return response.data;
  } catch (error) {
    console.log("review error", error);
    throw new Error("Lấy danh sách đánh giá không thành công");
  }
};

// cái này chưa có hả
export const getAvgRatingByProductId = async (productId) => {
  try {
    const response = await request(axiosPublic, {
      url: `/reviews/${productId}/avg`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy đánh giá trung bình không thành công");
  }
};

export const createReview = async (data) => {
  try {
    const { productId, rating, comment } = data;
    const response = await requestWithToken(axiosPublic, {
      url: `/reviews`,
      method: "POST",
      data: {
        productId,
        rating,
        comment,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Tạo đánh giá không thành công");
  }
};
