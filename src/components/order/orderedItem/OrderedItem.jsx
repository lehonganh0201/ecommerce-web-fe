/* eslint-disable */
import React, { useEffect, useState } from "react";
import { formatDate, formatNumber } from "@/utils/function/validateTime";
import { getOrderStatusInfo } from "@/apis/order"; // Sửa import đúng (từ utils/orderStatus)
import "./OrderedItem.scss";
import { getProductByVariantId } from "@/apis/variant";

const OrderedItem = ({ item }) => {
  const statusInfo = getOrderStatusInfo(item?.status);
  const [products, setProducts] = useState({}); // { variantId: { productName, imageUrl } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsForItems = async () => {
      if (!Array.isArray(item?.items) || item.items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const fetchPromises = item.items
          .filter((product) => product?.variantId && !product.productName)
          .map(async (product) => {
            try {
              const response = await getProductByVariantId(product.variantId);
              const productData = response?.data || {};
              setProducts((prev) => ({
                ...prev,
                [product.variantId]: {
                  productName: productData.productName,
                  imageUrl: productData.imageUrl || "",
                },
              }));
            } catch (error) {
              console.error(`Error fetching product for variant ${product.variantId}:`, error);
              setProducts((prev) => ({
                ...prev,
                [product.variantId]: {
                  productName: "Sản phẩm không xác định",
                  imageUrl: "",
                },
              }));
            }
          });

        await Promise.all(fetchPromises);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsForItems();
  }, [item?.items]);

  const getProductDetails = (variantId) => {
    return products[variantId] || {};
  };

  const getUnitPrice = (totalPrice, quantity) => {
    return quantity > 0 ? totalPrice / quantity : totalPrice;
  };

  const renderPaymentMethod = () => {
    const { method, status: paymentStatus } = item?.payment || {};
    const methodLabels = {
      COD: "Thanh toán khi nhận hàng",
      MOMO: "Phương thức thanh toán qua MoMo",
      "VN_PAY": "Phương thức thanh toán qua VNPAY",
    };
    const paymentLabel = methodLabels[method] || "Phương thức thanh toán không xác định";
    const paymentStatusLabel = paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán";
    return `${paymentLabel} - ${paymentStatusLabel}`;
  };

  if (loading) {
    return (
      <div className="shadow-lg rounded-lg p-4 mb-4">
        <p className="text-gray-500">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="shadow-lg rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <p className="italic">{formatDate(item?.createdAt)}</p>
        <div className="flex items-center gap-4">
          <span className={`status-badge px-2 py-1 rounded text-sm ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {item?.expectedDeliveryDate && (
            <p className="text-gray-600 text-sm">
              Dự kiến giao: {formatDate(item.expectedDeliveryDate)}
            </p>
          )}
        </div>
      </div>

      {Array.isArray(item?.items) && item?.items.length > 0 ? (
        item.items.map((product, index) => {
          const productDetails = getProductDetails(product?.variantId);
          const displayName = product?.productName || productDetails.productName;
          const displayImage = product?.imageUrl || productDetails.imageUrl;

          return (
            <div className="flex gap-4 items-center mb-4" key={product.id || index}>
              <img
                className="w-[100px] h-[100px] object-cover rounded-lg"
                src={
                  displayImage ||
                  "https://bode.vn/wp-content/uploads/2024/12/bo-ba-ba-nu-co-tim-khuy-boc-bo-de-2.jpg"
                }
                alt={displayName || "Sản phẩm"}
              />

              <div className="w-full flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">{displayName}</h3>
                  <p>
                    Giá đơn vị:{" "}
                    <span className="text-[#7d2111]">
                      {formatNumber(getUnitPrice(product?.totalPrice, product?.quantity))} đ
                    </span>
                  </p>
                  <p>
                    Số lượng: <span>{product?.quantity || 0}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Tổng giá: {formatNumber(product?.totalPrice)} đ
                  </p>
                </div>
                {/* Mã đơn hàng chỉ hiển thị ở item đầu tiên để tránh lặp */}
                {index === 0 && (
                  <div className="flex flex-col gap-2 method text-right">
                    <p>
                      Mã đơn hàng:{" "}
                      <span className="text-[#7d2111] font-semibold">{item?.orderCode}</span>
                    </p>
                    <p className="text-sm">{renderPaymentMethod()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 italic">Không có sản phẩm trong đơn hàng này</p>
      )}

      {/* Footer: Tổng đơn và địa chỉ nếu cần */}
      <div className="w-full flex justify-between items-center pt-4 border-t">
        <p className="text-gray-600">
          Địa chỉ: {item?.addressInfo || "Không xác định"}
        </p>
        <div className="italic font-semibold">
          Tổng đơn: {formatNumber(item?.totalAmount)} đ
        </div>
      </div>
    </div>
  );
};

export default OrderedItem;