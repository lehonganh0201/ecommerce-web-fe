/* eslint-disable */
import { getReferenceOrder } from "@/apis/order";
import Layout from "@/components/commons/layout/Layout";
import TitleRouter from "@/components/product/titleRouter/TitleRouter";
import React, { useState } from "react";

import "./References.scss";
import OrderedItem from "@/components/order/orderedItem/OrderedItem";
import { getProductByVariantId } from "@/apis/variant";
import { getProductById } from "@/apis/product";

const References = () => {
  const [references, setReferences] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    if (references.trim()) {
      setLoading(true);
      try {
        const response = await getReferenceOrder(references.trim());
        const orderData = response.data[0];

        const rawItems = orderData.orderItems || [];
        console.log("Raw items from orderData:", rawItems); 

        if (rawItems.length === 0) {
          console.warn("No items in orderData");
          setOrder({ ...orderData, items: [] });
          return;
        }

        const updatedItems = await Promise.all(
          rawItems.map(async (item) => {
            try {
              console.log(`Enriching item with variantId: ${item.variantId}`);  // DEBUG per item
              const detail = await getProductByVariantId(item.variantId);
              console.log("Variant detail:", detail?.data);  // DEBUG

              if (!detail?.data?.productId) {
                console.warn(`No productId for variant ${item.variantId}`);
                return {
                  ...item,
                  productName: "Sản phẩm không xác định",
                  imageUrl: "",
                };
              }

              const product = await getProductById(detail.data.productId);
              console.log("Full product:", product?.data);  // DEBUG

              return {
                ...item,
                productName: product?.data?.name || "Sản phẩm không xác định",
                imageUrl: product?.data?.images?.[0]?.image || "",
              };
            } catch (itemError) {
              console.error(`Error fetching product for variant ${item.variantId}:`, itemError);
              return {
                ...item,
                productName: "Sản phẩm không xác định",
                imageUrl: "",
              };
            }
          })
        );

        console.log("Updated items after enrich:", updatedItems);  // DEBUG: Check populated

        setOrder({
          ...orderData,
          items: updatedItems,  // Đảm bảo prop là items cho OrderedItem
        });
      } catch (error) {
        console.error("Lỗi khi kiểm tra đơn hàng:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    } else {
      setOrder(null);
    }
  };

  return (
    <Layout>
      <TitleRouter title={"Kiểm tra đơn hàng"} />
      <div className="references h-[500px]">
        <div className="w-full flex justify-center items-center gap-3">
          <input
            className="p-2 border border-gray-300 rounded outline-none focus:border-amber-700"
            placeholder="Nhập mã đơn hàng..."
            type="text"
            onChange={(e) => setReferences(e.target.value)}
            value={references}
            disabled={loading}
          />
          <button
            className="bg-[#ff6347] text-white cursor-pointer py-2 px-5 rounded hover:bg-[#eda092] disabled:opacity-50"
            onClick={handleResolve}
            disabled={loading || !references.trim()}
          >
            {loading ? "Đang kiểm tra..." : "Kiểm tra"}
          </button>
        </div>
        <p className="text-[#9d1d07] my-5">Thông tin đơn hàng</p>
        {loading ? (
          <p className="text-center">Đang tải thông tin đơn hàng...</p>
        ) : order ? (
          <OrderedItem item={order} />
        ) : (
          <div className="text-center text-gray-500">Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.</div>
        )}
      </div>
    </Layout>
  );
};

export default References;