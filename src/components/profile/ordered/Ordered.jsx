import React, { useEffect, useState } from "react";
import "./Ordered.scss";
import { getOrderByOrderType } from "@/apis/order";
import OrderedItem from "@/components/order/orderedItem/OrderedItem";
import { getProductByVariantId } from "@/apis/variant";
import { getProductById } from "@/apis/product";

const Ordered = () => {
  const [orderType, setOrderType] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const getStatusFromOrderType = (type) => {
    switch (type) {
      case "PENDING":
        return "PROCESSING";
      case "SHIPPED":
        return "DELIVERED"; 
      case "CANCELED":
        return "CANCELED";
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const status = getStatusFromOrderType(orderType);
        const response = await getOrderByOrderType(orderType || null, { page: currentPage, size: 10 });
        const { data: ordersData = [], meta = {} } = response || {};

        setTotalPages(meta.totalPages || 0);
        setHasNext(meta.hasNext || false);

        const updatedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const updatedItems = Array.isArray(order.orderItems)
              ? await Promise.all(
                  order.orderItems.map(async (item) => {
                    try {
                      const detail = await getProductByVariantId(item.variantId);
                      const product = await getProductById(detail?.data?.productId);

                      console.log("Fetched product detail:", product);
                      return {
                        ...item,
                        productName: product?.data?.name,
                        imageUrl: product?.data?.images[0].image
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
                )
              : []; 

            return {
              ...order,
              items: updatedItems,
            };
          })
        );

        setOrders(updatedOrders);
        console.log("Fetched orders:", updatedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (orderType !== undefined) { 
      fetchOrders();
    }
  }, [orderType, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="ordered__pagination flex justify-center gap-2 mt-5">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-1 bg-gray-200 rounded">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <div className="ordered" data-aos="fade-left">
      <div className="ordered__container">
        <h1 className="ordered__container-title">Lịch sử mua hàng</h1>
        <div className="ordered__container-menu">
          <p
            onClick={() => {
              setOrderType("");
              setCurrentPage(0);
            }}
            className={`${orderType === "" ? "bg-[#7d2111]" : "bg-[#ff6347]"}`}
          >
            Tất cả
          </p>
          <p
            onClick={() => {
              setOrderType("PENDING");
              setCurrentPage(0);
            }}
            className={`${
              orderType === "PENDING" ? "bg-[#7d2111]" : "bg-[#ff6347]"
            }`}
          >
            Đang giao hàng
          </p>
          <p
            onClick={() => {
              setOrderType("SHIPPED");
              setCurrentPage(0);
            }}
            className={`${
              orderType === "SHIPPED" ? "bg-[#7d2111]" : "bg-[#ff6347]"
            }`}
          >
            Đã giao hàng
          </p>
          <p
            onClick={() => {
              setOrderType("CANCELED");
              setCurrentPage(0);
            }}
            className={`${
              orderType === "CANCELED" ? "bg-[#7d2111]" : "bg-[#ff6347]"
            }`}
          >
            Đã hủy
          </p>
        </div>
        {loading ? (
          <p className="ordered__container-loading">Đang tải đơn hàng...</p>
        ) : orders.length > 0 ? (
          <>
            <div className="w-full h-auto flex flex-col gap-5 mt-5">
              {orders.map((order) => (
                <OrderedItem item={order} key={order.id} /> 
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <p className="ordered__container-empty">Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default Ordered;