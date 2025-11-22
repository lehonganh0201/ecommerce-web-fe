import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";
import axios from "axios";

export const getMe = async () => {
  try {
    const response = await request(axiosPrivate, {
      url: "/users/me",
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy thông tin người dùng không thành công");
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); 

    const response = await request(axiosPrivate, {
      url: "/users/upload",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi upload avatar:", error);
    throw new Error("Upload avatar không thành công");
  }
};

export const getProvinces = async () => {
  try {
    const response = await axios.get("https://provinces.open-api.vn/api/p/");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
    throw new Error("Lấy danh sách tỉnh thành không thành công");
  }
};

export const getDistricts = async (provinceCode) => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );
    return response.data.districts;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách quận huyện không thành công");
  }
};

export const getWards = async (districtCode) => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    return response.data.wards;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách phường xã không thành công");
  }
};

export const createdAddress = async (address) => {
  try {
    const {
      phoneNumber,
      street,
      houseNumber,
      ward,
      district,
      city,
      description,
      isDefault,
      fullAddress,
    } = address;
    const response = await request(axiosPrivate, {
      url: "/addresses",
      method: "POST",
      data: {
        phoneNumber,
        street,
        houseNumber,
        ward,
        district,
        city,
        description,
        isDefault,
        fullAddress,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi tạo địa chỉ:", error);
    throw new Error("Tạo địa chỉ không thành công");
  }
};

export const getAddresses = async () => {
  try {
    const response = await request(axiosPrivate, {
      url: "/addresses",
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
    throw new Error("Lấy danh sách địa chỉ không thành công");
  }
};

export const getAddressesById = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/addresses/${id}`,
      method: "GET",
    });
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ theo ID:", error);
    throw new Error("Lấy địa chỉ theo ID không thành công");
  }
};

export const updateAddress = async (address) => {
  try {
    const {
      id,
      phoneNumber,
      street,
      houseNumber,
      ward,
      district,
      city,
      description,
      isDefault,
      fullAddress,
    } = address;
    const response = await request(axiosPrivate, {
      url: `/addresses/${id}`,
      method: "PUT",
      data: {
        phoneNumber,
        street,
        houseNumber,
        ward,
        district,
        city,
        description,
        isDefault,
        fullAddress,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error);
    throw new Error("Cập nhật địa chỉ không thành công");
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/addresses/${id}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa địa chỉ:", error);
    throw new Error("Xóa địa chỉ không thành công");
  }
};

export const getUsers = async (params = {}) => {
  try {
    const response = await request(axiosPrivate, {
      url: "/users",
      method: "GET",
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    throw new Error("Lấy danh sách người dùng không thành công");
  }
};

export const getUserById = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/users/${id}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw new Error("Lấy thông tin người dùng không thành công");
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/users/${id}`,
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    throw new Error("Cập nhật người dùng không thành công");
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/users/${id}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw new Error("Xóa người dùng không thành công");
  }
};

export const toggleUserLock = async (id, requestBody) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/users/${id}/lock`,
      method: "PUT",
      data: requestBody,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thay đổi trạng thái khóa:", error);
    throw new Error("Thay đổi trạng thái khóa không thành công");
  }
};

export const changeUserPassword = async (id, requestBody) => {
  try {
    const response = await request(axiosPrivate, {
      url: `/users/${id}/password`,
      method: "PUT",
      data: requestBody,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    throw new Error("Đổi mật khẩu không thành công");
  }
};