import React, { useState, useEffect } from "react";
import ImageOrderGallery from "./ImageOrderGallery";
import { getProductByVariantId } from "@/apis/variant";
import { getProductByProductId } from "@/apis/product";

const OrderItemsGallery = ({ items, token }) => {
  const [itemsWithImages, setItemsWithImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const newItems = await Promise.all(
        items.map(async (item) => {
          if (item.image) return item;
          try {
            const res = await getProductByVariantId(item.variantId);
            const variant = res.data;
            const response = await getProductByProductId(variant.productId);
            const product = response.data;
            return {
              ...item,
              image: variant.image,
              productName: product.name,
              stock: variant.stockQuantity,
              attributes: variant.variantAttributes,
              price: variant.price,
            };
          } catch (err) {
            console.log("err:", err);
            return { ...item, image: "" };
          }
        })
      );
      setItemsWithImages(newItems);
    }
    fetchImages();
  }, [items, token]);

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
      <ImageOrderGallery items={itemsWithImages} token={token} />
      <div className="mt-6">
        <div className="text-sm text-gray-500 mb-2">Tóm tắt đơn hàng</div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">Tổng đơn hàng:</div>
            <div className="text-right font-medium">
              {items.length} sản phẩm
            </div>
            <div className="text-gray-600">Tổng:</div>
            <div className="text-right font-medium">
              {items
                .reduce(
                  (sum, item) =>
                    sum + parseFloat(item.totalPrice) * item.quantity,
                  0
                )
                .toFixed(2)}{" "}
              VND
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsGallery;
