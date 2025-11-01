import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const register = async (data) => {
  try {
    const { username, password, email, firstName, lastName, phoneNumber, isMale, dateOfBirth } = data;

    await request(axiosPublic, {
      url: "/auth/register",
      method: "POST",
      data: {
        username,
        password,
        email,
        firstName,
        lastName,
        phoneNumber,
        isMale,
        dateOfBirth,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Đăng ký không thành công");
  }
};

export const verifyOTP = async (data) => {
  try {
    const { email, otp } = data;
    await request(axiosPublic, {
      url: "/auth/verify",
      method: "POST",
      data: {
        email,
        otp,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Xác thực OTP thất bại");
  }
};

export const login = async (data) => {
  try {
    const { usernameOrEmail, password } = data;
    const response = await request(axiosPublic, {
      url: "/auth/login",
      method: "POST",
      data: {
        usernameOrEmail,
        password,
      },
    });
    const { accessToken, refreshToken, fullName, role } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("role", role);
    localStorage.removeItem("cart");
    return response.data;
  } catch (error) {
    console.error("Login API error:", JSON.stringify(error, null, 2));
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem("refreshToken");
    const response = await request(axiosPublic, {
      url: "/auth/refresh-token",
      method: "POST",
      data: {
        Authorization: `Bearer ${refresh_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Refresh token API error:", JSON.stringify(error, null, 2));
    throw error;
  }
};

export const forgotPassword = async (data) => {
  try {
    const { email } = data;
    await request(axiosPublic, {
      url: "/auth/forgot-password",
      method: "POST",
      data: {
        email,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Quên mật khẩu không thành công");
  }
};

export const changePassword = async (data) => {
  try {
    const { token, email, newPassword } = data;
    await request(axiosPrivate, {
      url: "/auth/reset-password",
      method: "POST",
      data: {
        token,
        email,
        newPassword,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Đổi mật khẩu không thành công");
  }
};
