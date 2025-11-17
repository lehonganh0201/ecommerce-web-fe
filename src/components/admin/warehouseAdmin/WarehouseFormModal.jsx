// src/components/admin/warehouseAdmin/WarehouseFormModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getUsers, getProvinces, getDistricts, getWards } from "@/apis/user";

const WarehouseFormModal = ({ isOpen, onClose, onSubmit, initialData, formType }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    wardName: "", // Lưu name cho ward
    wardCode: "", // Lưu code cho load wards (nếu cần nested)
    districtName: "",
    districtCode: "",
    cityName: "",
    cityCode: "",
    description: "",
    maxCapacity: "",
    status: "OPEN",
    managerId: "",
    address: {
      street: "",
      houseNumber: "", // Thêm nếu backend cần
      ward: "",
      district: "",
      city: "",
      description: "",
      isDefault: false,
      fullAddress: "",
    },
  });
  const [managers, setManagers] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        name: initialData.name || "",
        phoneNumber: initialData.phoneNumber || "",
        street: initialData.street || "",
        cityName: initialData.city || "",
        cityCode: "", // Sẽ load từ provinces
        districtName: initialData.district || "",
        districtCode: "",
        wardName: initialData.ward || "",
        wardCode: "",
        description: initialData.description || "",
        maxCapacity: initialData.maxCapacity ? initialData.maxCapacity.toString() : "", // Convert to string for input
        status: initialData.status || "OPEN",
        managerId: initialData.managerId || "",
        address: {
          ...initialData.address,
          street: initialData.street || "",
          city: initialData.city || "",
          district: initialData.district || "",
          ward: initialData.ward || "",
        },
      });
      // Load provinces trước để match code cho initial data
      loadProvinces().then(() => {
        // Sau khi có provinces, set code từ name
        if (initialData.city) {
          const selectedCity = provinces.find(p => p.name === initialData.city);
          if (selectedCity) {
            setFormData(prev => ({ ...prev, cityCode: selectedCity.code.toString() }));
            loadDistricts(selectedCity.code).then(() => {
              if (initialData.district) {
                const selectedDistrict = districts.find(d => d.name === initialData.district);
                if (selectedDistrict) {
                  setFormData(prev => ({ ...prev, districtCode: selectedDistrict.code.toString() }));
                  loadWards(selectedDistrict.code);
                }
              }
            });
          }
        }
      });
    } else {
      // Reset for add
      setFormData({
        name: "",
        phoneNumber: "",
        street: "",
        wardName: "",
        wardCode: "",
        districtName: "",
        districtCode: "",
        cityName: "",
        cityCode: "",
        description: "",
        maxCapacity: "",
        status: "OPEN",
        managerId: "",
        address: {
          street: "",
          houseNumber: "",
          ward: "",
          district: "",
          city: "",
          description: "",
          isDefault: false,
          fullAddress: "",
        },
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchManagers();
    loadProvinces();
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await getUsers({ page: 0, size: 100 });
      setManagers(res.data || []);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };

  const loadProvinces = async () => {
    try {
      const data = await getProvinces();
      setProvinces(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDistricts = async (provinceCode) => {
    try {
      const data = await getDistricts(provinceCode);
      setDistricts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWards = async (districtCode) => {
    try {
      const data = await getWards(districtCode);
      setWards(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCityChange = (e) => {
    const code = e.target.value; // Number as string from select
    const selectedCity = provinces.find(p => p.code.toString() === code);
    setFormData(prev => ({
      ...prev,
      cityCode: code,
      cityName: selectedCity?.name || "",
      address: { ...prev.address, city: selectedCity?.name || "" },
      districtCode: "", // Reset
      districtName: "",
      wardCode: "",
      wardName: "",
    }));
    setDistricts([]);
    setWards([]);
    if (code) {
      loadDistricts(parseInt(code));
    }
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const selectedDistrict = districts.find(d => d.code.toString() === code);
    setFormData(prev => ({
      ...prev,
      districtCode: code,
      districtName: selectedDistrict?.name || "",
      address: { ...prev.address, district: selectedDistrict?.name || "" },
      wardCode: "",
      wardName: "",
    }));
    setWards([]);
    if (code) {
      loadWards(parseInt(code));
    }
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    const selectedWard = wards.find(w => w.code.toString() === code);
    setFormData(prev => ({
      ...prev,
      wardCode: code,
      wardName: selectedWard?.name || "",
      address: { ...prev.address, ward: selectedWard?.name || "" },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.maxCapacity || isNaN(parseInt(formData.maxCapacity))) {
      toast.error("Dung lượng phải là số hợp lệ");
      return;
    }
    const fullAddress = `${formData.street || ""}, ${formData.wardName || ""}, ${formData.districtName || ""}, ${formData.cityName || ""}`;
    const submitData = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      street: formData.street,
      ward: formData.wardName,
      district: formData.districtName,
      city: formData.cityName,
      description: formData.description,
      maxCapacity: parseInt(formData.maxCapacity),
      status: formData.status,
      managerId: formData.managerId,
      address: {
        ...formData.address,
        phoneNumber: formData.phoneNumber,
        street: formData.street,
        ward: formData.wardName,
        district: formData.districtName,
        city: formData.cityName,
        fullAddress,
      },
    };
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {formType === "edit" ? "Sửa kho" : "Thêm kho"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên kho</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đường</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value, address: { ...formData.address, street: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
            <select
              value={formData.cityCode || ""}  
              onChange={handleCityChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Chọn thành phố</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code.toString()}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
            <select
              value={formData.districtCode || ""}
              onChange={handleDistrictChange}
              disabled={!formData.cityCode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              required
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code.toString()}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
            <select
              value={formData.wardCode || ""}
              onChange={handleWardChange}
              disabled={!formData.districtCode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              required
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code.toString()}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dung lượng tối đa</label>
            <input
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              min="1"
              max="10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="OPEN">Mở</option>
              <option value="CLOSED">Đóng</option>
              <option value="UNDER_MAINTENANCE">Bảo trì</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quản lý</label>
            <select
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Chọn quản lý</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.username} ({manager.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseFormModal;