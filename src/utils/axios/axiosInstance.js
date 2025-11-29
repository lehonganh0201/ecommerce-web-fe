import { refreshToken } from "@/apis/auth";
import axios from "axios";
import { get, set } from "lodash";

const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL,
    withCredentials: true,
  });
};

// Instance không token (dùng cho login, public...)
const axiosPublic = createAxiosInstance(import.meta.env.VITE_API_URL);

// Instance có token (dùng cho API cần đăng nhập)
const axiosPrivate = createAxiosInstance(import.meta.env.VITE_API_URL);

axiosPrivate.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return request;
    }
    set(request, "headers.Authorization", `Bearer ${token}`);
    return request;
  },
  (_error) => {
    console.log(
      "🚀 ~ axiosInstance.interceptors.request.use ~ _error:",
      _error
    );
    const errorResponse = {
      status: null,
      message: null,
      errors: null,
    };
    return Promise.reject(errorResponse);
  }
);

// ----- Response Interceptor -----
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosPrivate(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const response = await refreshToken();
        const { accessToken } = response.data;  // Extract cả hai nếu BE trả

        // FIX: Lưu token mới vào localStorage
        localStorage.setItem("accessToken", accessToken);

        console.log("New accessToken saved to localStorage:", accessToken.substring(0, 20) + "...");  // DEBUG: Log partial token

        // Set header cho requests sau
        axiosPrivate.defaults.headers.common["Authorization"] = "Bearer " + accessToken;

        // Process queue với token mới
        processQueue(null, accessToken);

        // Retry original request
        return axiosPrivate(originalRequest);
      } catch (error) {
        // FAIL: Clear storage và redirect (uncomment để dùng)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("fullName");
        // window.location.href = "/auth";
        processQueue(error, null);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    if (error.response.status === 401) {
      // FAIL: Clear và redirect (uncomment nếu muốn strict)
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
      // localStorage.removeItem("role");
      // localStorage.removeItem("fullName");
      // window.location.href = "/auth";
      return Promise.reject(error);
    }
    const errorResponse = {
      status: get(error, "response.status", null),
      message: get(error, "response.data.message", null),
      errors: get(error, "response.data.errors", null),
    };
    return Promise.reject(errorResponse);
  }
);

export { axiosPublic, axiosPrivate };
