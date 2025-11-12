/* eslint-disable */
import {
  createdAddress,
  getDistricts,
  getProvinces,
  getWards,
} from "@/apis/user";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const Address = ({ setIsShowAddAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [addressDetail, setAddressDetail] = useState({
    phoneNumber: "",
    street: "",
    houseNumber: "",
    description: "",
    isDefault: false,
    fullAddress: "",
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvinces();
        setProvinces(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const response = await getDistricts(selectedProvince);
          setDistricts(response);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách quận huyện:", error);
        }
      } else {
        setDistricts([]);
        setSelectedDistrict("");
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const response = await getWards(selectedDistrict);
          setWards(response);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách phường xã:", error);
        }
      } else {
        setWards([]);
        setSelectedWard("");
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  const handleCancel = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setAddressDetail({
      phoneNumber: "",
      street: "",
      houseNumber: "",
      description: "",
      isDefault: false,
      fullAddress: "",
    });
    setIsShowAddAddress(false);
  };

  const generateFullAddress = () => {
    const houseNum = addressDetail.houseNumber ? `${addressDetail.houseNumber}, ` : "";
    const streetAddr = addressDetail.street ? `${addressDetail.street}, ` : "";
    const wardName = wards.find((ward) => ward.code.toString() === selectedWard)?.name || "";
    const districtName = districts.find((district) => district.code.toString() === selectedDistrict)?.name || "";
    const cityName = provinces.find((province) => province.code.toString() === selectedProvince)?.name || "";
    return `${houseNum}${streetAddr}${wardName}, ${districtName}, ${cityName}`.replace(/, $/, "").trim();
  };

  const handleSaveAddress = async () => {
    if (
      !selectedProvince ||
      !selectedWard ||
      !addressDetail.phoneNumber ||
      !addressDetail.street.trim()
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ bắt buộc (số điện thoại, tỉnh/thành phố, phường/xã, đường).");
      return;
    }

    const selectedCity = provinces.find((province) => province.code.toString() === selectedProvince)?.name || "";
    const selectedDistrictName = districts.find((district) => district.code.toString() === selectedDistrict)?.name || "";
    const selectedWardName = wards.find((ward) => ward.code.toString() === selectedWard)?.name || "";
    const fullAddr = generateFullAddress();

    const newAddress = {
      phoneNumber: addressDetail.phoneNumber,
      street: addressDetail.street,
      houseNumber: addressDetail.houseNumber,
      ward: selectedWardName,
      district: selectedDistrictName,
      city: selectedCity,
      description: addressDetail.description,
      isDefault: addressDetail.isDefault,
      fullAddress: fullAddr,
    };

    try {
      const response = await createdAddress(newAddress);
      // console.log("Địa chỉ đã được lưu:", response);
    } catch (error) {
      console.log("Error saving address:", error);
    }
  
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setAddressDetail({
      phoneNumber: "",
      street: "",
      houseNumber: "",
      description: "",
      isDefault: false,
      fullAddress: "",
    });
    setIsShowAddAddress(false);
  };

  return (
    <div className="w-[700px] h-[672px] bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <h1 className="text-[20px] font-bold mb-4 text-[#ff6347]">
          Thêm mới địa chỉ nhận hàng
        </h1>
        <IoClose
          className="text-[20px]"
          onClick={() => setIsShowAddAddress(false)}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <p className="w-[170px] text-[16px] text-amber-900">
            Số điện thoại <span className="text-red-500">*</span>
          </p>
          <input
            onChange={(e) =>
              setAddressDetail({
                ...addressDetail,
                phoneNumber: e.target.value,
              })
            }
            value={addressDetail.phoneNumber}
            className="w-full px-2 h-[35px] border border-amber-900 outline-0 focus:outline-amber-100 rounded"
            type="tel"
          />
        </div>
        <div className="flex gap-2">
          <p className="w-[170px] text-[16px] text-amber-900">
            Tỉnh/ Thành phố <span className="text-red-500">*</span>
          </p>
          <select
            onChange={(e) => setSelectedProvince(e.target.value)}
            value={selectedProvince}
            className="w-full px-2 h-[35px] border border-amber-900 outline-0 focus:outline-amber-100 rounded"
          >
            <option value="">Chọn tỉnh/ thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <p className="w-[170px] text-[16px] text-amber-900">
            Quận/ Huyện
          </p>
          <select
            className="w-full px-2 h-[35px] border border-amber-900 outline-0 focus:outline-amber-100 rounded"
            onChange={(e) => setSelectedDistrict(e.target.value)}
            value={selectedDistrict}
          >
            <option value="">Chọn quận/ huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <p className="w-[170px] text-[16px] text-amber-900">
            Phường/ Xã <span className="text-red-500">*</span>
          </p>
          <select
            className="w-full px-2 h-[35px] border border-amber-900 outline-0 focus:outline-amber-100 rounded"
            onChange={(e) => setSelectedWard(e.target.value)}
            value={selectedWard}
          >
            <option value="">Chọn phường/ xã</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <p className="w-[170px] text-[16px] text-amber-900">
            Số nhà
          </p>
          <input
            onChange={(e) =>
              setAddressDetail({
                ...addressDetail,
                houseNumber: e.target.value,
              })
            }
            value={addressDetail.houseNumber}
            className="w-full px-2 h-[35px] border border-amber-900 outline-0 focus:outline-amber-100 rounded"
            placeholder="Nhập số nhà (ví dụ: 123/45)"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="w-[170px] text-[16px] text-amber-900">
            Đường <span className="text-red-500">*</span>
          </p>
          <textarea
            className="w-full h-[60px] px-2 border border-amber-900 outline-0 focus:outline-amber-100 rounded"
            placeholder="Nhập tên đường"
            value={addressDetail.street}
            onChange={(e) =>
              setAddressDetail({
                ...addressDetail,
                street: e.target.value,
              })
            }
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <p className="w-[170px] text-[16px] text-amber-900">
            Ghi chú
          </p>
          <textarea
            className="w-full h-[60px] px-2 border border-amber-900 outline-0 focus:outline-amber-100 rounded"
            placeholder="Nhập ghi chú thêm (tùy chọn)"
            value={addressDetail.description}
            onChange={(e) =>
              setAddressDetail({
                ...addressDetail,
                description: e.target.value,
              })
            }
          ></textarea>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={addressDetail.isDefault}
            onChange={(e) =>
              setAddressDetail({
                ...addressDetail,
                isDefault: e.target.checked,
              })
            }
          />
          <label htmlFor="isDefault" className="text-[16px] text-amber-900">
            Địa chỉ mặc định
          </label>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="py-2 px-6 border-[#ff6347] text-[#ff6347] hover:bg-[#ff6347] hover:text-white border rounded cursor-pointer"
            onClick={handleCancel}
          >
            Hủy
          </button>
          <button
            className="py-2 px-4 border-[#2349f6] text-[#2349f6] hover:bg-[#2349f6] hover:text-white border rounded cursor-pointer"
            onClick={handleSaveAddress}
          >
            Lưu địa chỉ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;