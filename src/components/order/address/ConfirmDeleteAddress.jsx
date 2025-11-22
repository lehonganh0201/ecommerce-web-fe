/* eslint-disable */
import { deleteAddress } from "@/apis/user";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const ConfirmDeleteAddress = ({ deleteAddressData, setDeleteAddressData, onDeleteSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setDeleteAddressData({ id: null, isShowDeleteAddress: false });
  };

  const handleAgree = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await deleteAddress(deleteAddressData.id);
      toast.success("Xóa địa chỉ thành công");
      setDeleteAddressData({ id: null, isShowDeleteAddress: false });
      if (onDeleteSuccess) {
        onDeleteSuccess(); 
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Xóa địa chỉ thất bại: " + (error.message || "Lỗi không xác định"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[500px] h-[150px] bg-white rounded-lg shadow-lg flex flex-col justify-between p-6">
      <div className="w-full flex justify-between items-center mb-4">
        <div></div>
        <div className="text-[20px] text-amber-900 font-bold">
          Bạn chắc chắn muốn xóa địa chỉ này?
        </div>
        <IoClose onClick={handleClose} className="text-[20px] cursor-pointer" />
      </div>
      <div className="w-full flex justify-center items-center gap-4">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-[20px] py-[5px] border border-amber-700 text-amber-600 bg-white rounded hover:bg-amber-700 hover:text-white cursor-pointer disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          onClick={handleAgree}
          disabled={isLoading}
          className="px-[20px] py-[5px] border border-b-blue-600 text-blue-600 bg-white rounded hover:bg-blue-600 hover:text-white cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "Đang xóa..." : "Đồng ý"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteAddress;