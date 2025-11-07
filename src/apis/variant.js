import { request } from "@/utils/axios/axios-http";
import { axiosPublic } from "@/utils/axios/axiosInstance";

export const getProductByVariantId = async (variantId) => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: `/variants/${variantId}`,
    })
    return response.data
  } catch (error) {
    console.log(`Error fetching product by variant ID ${variantId}:`, error)
    throw new Error(`Failed to fetch product by variant ID ${variantId}`)
  }
}

export const getVariantsByProductId = async (productId) => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: `/variants/product/${productId}`,
    })
    return response.data
  } catch (error) {
    console.log(`Error fetching product by variant ID ${productId}:`, error)
    throw new Error(`Failed to fetch product by variant ID ${productId}`)
  }
}