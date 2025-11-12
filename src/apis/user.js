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
    // Response có thể là thông báo thành công hoặc AddressResponse đã xóa (tùy backend), sử dụng để remove item khỏi list UI
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa địa chỉ:", error);
    throw new Error("Xóa địa chỉ không thành công");
  }
};