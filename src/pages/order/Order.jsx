/* eslint-disable */
import React, { useState } from "react";

import "./Order.scss";
import Layout from "@/components/commons/layout/Layout";
import LeftOrder from "@/components/order/leftOrder/LeftOrder";
import RightOrder from "@/components/order/rightOrder/RightOrder";
import Address from "@/components/order/address/Address";
import UpdateAddress from "@/components/order/address/UpdateAddress";
import ConfirmDeleteAddress from "@/components/order/address/ConfirmDeleteAddress";

const Order = () => {
  const [isShowAddAddress, setIsShowAddAddress] = useState(false);
  const [editAddress, setEditAddress] = useState({
    id: null,
    isShowUpdateAddress: false,
  });
  const [deleteAddressData, setDeleteAddressData] = useState({  // Rename state
    id: null,
    isShowDeleteAddress: false,
  });
  const [orderInformation, setOrderInformation] = useState({
    paymentMethod: "COD",
    addressId: null,
    language: "vi",
    bankCode: null,
    items: [],
  });

  // Callback để refresh addresses sau khi xóa (gọi getAddresses ở LeftOrder nếu cần)
  const handleDeleteSuccess = () => {
    // Ví dụ: Nếu LeftOrder có refetch function, gọi nó ở đây
    // Hoặc emit event/props drill down để refresh
    console.log("Refresh addresses list after delete");
    // Nếu cần: window.dispatchEvent(new CustomEvent('refreshAddresses'));
  };

  return (
    <>
      <Layout>
        <div className="order">
          <LeftOrder
            setIsShowAddAddress={setIsShowAddAddress}
            isShowAddAddress={isShowAddAddress}
            setEditAddress={setEditAddress}
            setDeleteAddressData={setDeleteAddressData}  // Rename setter
            isShowEditAddress={editAddress.isShowUpdateAddress}
            isShowDeleteAddress={deleteAddressData.isShowDeleteAddress}  // Rename
            orderInformation={orderInformation}
            setOrderInformation={setOrderInformation}
          />
          <RightOrder
            orderInformation={orderInformation}
            setOrderInformation={setOrderInformation}
          />
        </div>
      </Layout>
      {isShowAddAddress && (
        <div className="fixed inset-0 z-10 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() => setIsShowAddAddress(false)}
          ></div>
          <div className="relative z-20">
            <Address setIsShowAddAddress={setIsShowAddAddress} />
          </div>
        </div>
      )}
      {editAddress.isShowUpdateAddress && (
        <div className="fixed inset-0 z-10 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() =>
              setEditAddress({ id: null, isShowUpdateAddress: false })
            }
          ></div>
          <div className="relative z-20">
            <UpdateAddress
              editAddress={editAddress}
              setEditAddress={setEditAddress}
            />
          </div>
        </div>
      )}
      {deleteAddressData.isShowDeleteAddress && (
        <div className="fixed inset-0 z-10 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() =>
              setDeleteAddressData({ id: null, isShowDeleteAddress: false })
            }
          ></div>
          <div className="relative z-20">
            <ConfirmDeleteAddress
              deleteAddressData={deleteAddressData}
              setDeleteAddressData={setDeleteAddressData}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Order;