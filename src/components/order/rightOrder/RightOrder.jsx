/* eslint-disable */
import React, { useEffect, useState } from "react";

import "./RightOrder.scss";
import { useSelector, useDispatch } from "react-redux"; // Thêm dispatch nếu cần update store
import { formatNumber } from "@/utils/function/validateTime";
import { GrFormPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { createdOrder } from "@/apis/order";
import { toast } from "react-toastify";
import { getProductsInCart } from "@/apis/cart"; // Nếu cần fallback
import { getProductByVariantId } from "@/apis/variant";
import { getProductById } from "@/apis/product";

const RightOrder = ({ orderInformation, setOrderInformation }) => {
  console.log("RightOrder ~ orderInformation:", orderInformation);
  const selectedProductsFromStore = useSelector(
    (state) => state.order.orderList || []
  );
  const totalPriceFromStore = useSelector(
    (state) => state.order.totalPrice || 0
  );
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState(totalPriceFromStore);
  const [isLogin, setIsLogin] = useState(false);
  const [variantIds, setVariantIds] = useState([]);
  const [productIdVariant, setProductIdVariant] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Kiểm tra trạng thái login
    const token = localStorage.getItem("accessToken");
    setIsLogin(!!token);

    const fetchProductsForOrder = async () => {
      try {
        if (token && selectedProductsFromStore.length > 0) {
          // Nếu đã đăng nhập và có orderList từ store, fetch chi tiết dựa trên variantIds
          const variantIdsFromStore = selectedProductsFromStore
            .map((item) => item.variantId)
            .filter((id) => id !== undefined && id !== null); // Lọc bỏ undefined/null

          if (variantIdsFromStore.length === 0) {
            // Nếu không có variantId hợp lệ, dùng store data trực tiếp
            setProducts(selectedProductsFromStore);
            setPrice(totalPriceFromStore);
            return;
          }

          setVariantIds(variantIdsFromStore);

          // === Gọi API variant để lấy productId ===
          const variantResList = await Promise.all(
            variantIdsFromStore.map((id) => getProductByVariantId(id))
          );
          const productIds = variantResList.map((res) => res.data.productId);
          setProductIdVariant(productIds);

          // === Gọi API product để lấy thông tin sản phẩm ===
          const productResList = await Promise.all(
            productIds.map((id) => getProductById(id))
          );
          const productList = productResList.map((res) => res.data);
          setProductDetails(productList);

          // Tạo map từ variantId sang productDetail để merge đúng
          const variantToProductMap = new Map();
          variantIdsFromStore.forEach((variantId, index) => {
            if (productList[index]) {
              variantToProductMap.set(variantId, productList[index]);
            }
          });

          // Merge chi tiết vào products (dựa trên orderList)
          const mergedProducts = selectedProductsFromStore
            .filter((item) => item.variantId) // Chỉ lấy các sản phẩm có variantId hợp lệ
            .map((storeItem) => {
              const productDetail = variantToProductMap.get(
                storeItem.variantId
              );
              return {
                ...storeItem,
                ...productDetail, // Merge name, imageUrl, attributes, price từ productDetails
                productName:
                  productDetail?.name ||
                  storeItem.productName ||
                  storeItem.name,
                imageUrl: productDetail?.imageUrl || storeItem.imageUrl,
                images: productDetail?.images || storeItem.images || [],
                attributes:
                  productDetail?.attributes || storeItem.attributes || [],
                price: productDetail?.price || storeItem.price,
              };
            });
          setProducts(mergedProducts);
          setPrice(totalPriceFromStore); // Hoặc recalculate từ merged

          // Fallback nếu API fail, dùng store data trực tiếp
        } else if (selectedProductsFromStore.length > 0) {
          // Không login hoặc fallback: Dùng store data (giả sử store đã có full info)
          setProducts(selectedProductsFromStore);
          setPrice(totalPriceFromStore);
        } else {
          // Không có sản phẩm, redirect về cart
          navigate("/cart");
        }
      } catch (error) {
        console.log("Error fetching products for order:", error);
        toast.error("Lỗi khi tải thông tin sản phẩm");

        // Fallback: Dùng store data
        setProducts(selectedProductsFromStore);
        setPrice(totalPriceFromStore);
      }
    };

    fetchProductsForOrder();
  }, [selectedProductsFromStore, totalPriceFromStore]); // Deps: Trigger khi store thay đổi

  const handleClickQuantity = (product, status) => {
    const updatedProducts = products.map((item) => {
      if (item.variantId === product.variantId) {
        const newQuantity =
          status === "increase"
            ? item.quantity + 1
            : Math.max(1, item.quantity - 1); // Min 1
        return {
          ...item,
          quantity: newQuantity,
        };
      }
      return item;
    });
    setProducts(updatedProducts);

    // Recalculate total
    const newTotal = updatedProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setPrice(newTotal);

    // Update store nếu cần (dispatch action update orderList)
    // dispatch(updateOrderQuantity({ variantId: product.variantId, quantity: newQuantity }));

    // Update orderInformation cho API
    setOrderInformation((prev) => ({
      ...prev,
      orderItems: updatedProducts.map((p) => ({
        variantId: p.variantId,
        quantity: p.quantity,
      })),
    }));
  };

  useEffect(() => {
    // Sync với store nếu có thay đổi từ ngoài
    setOrderInformation((prev) => ({
      ...prev,
      orderItems: products.map((product) => ({
        variantId: product.variantId,
        quantity: product.quantity,
      })),
    }));
  }, [products]);

  const handleOrder = async () => {
    console.log("Updated order information:", orderInformation);
    if (products.length === 0) {
      toast.error("Không có sản phẩm nào để đặt hàng!");
      return;
    }
    if (!orderInformation.addressId) {
      toast.error("Vui lòng chọn địa chỉ nhận hàng!");
      return;
    }

    try {
      const response = await createdOrder(orderInformation);
      toast.success("Đặt hàng thành công!");
      if (response.data.payment.paymentUrl) {
        window.location.href = response.data.payment.paymentUrl;
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("Error creating order:", error);
      toast.error("Đặt hàng thất bại!");
    }
  };

  return (
    <div className="rightOrder">
      <h1>Đơn hàng ({products.length} sản phẩm)</h1>
      <div className="rightOrder__list">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={`${product.variantId}-${index}`}
              className="rightOrder__list-item"
            >
              <img
                src={
                  product.images?.[0]?.image ||
                  product.imageUrl ||
                  product.image ||
                  ""
                }
                alt={product.productName || product.name}
              />
              <div className="rightOrder__list-item-info">
                <p>{product.productName || product.name}</p>
                {product.attributes &&
                  product.attributes.length > 0 &&
                  product.attributes.map((attribute, attrIndex) => (
                    <p
                      key={attrIndex}
                      className="rightOrder__list-item-info-type"
                    >
                      {attribute.type}: {attribute.value}
                    </p>
                  ))}
                <div className="rightOrder__list-item-info-price">
                  <div className="rightOrder__list-item-info-price-quantity">
                    <button
                      className="rightOrder__list-item-info-price-quantity-button"
                      onClick={() => handleClickQuantity(product, "decrease")}
                      disabled={product.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      className="rightOrder__list-item-info-price-quantity-button"
                      onClick={() => handleClickQuantity(product, "increase")}
                    >
                      +
                    </button>
                  </div>
                  <p>{formatNumber(product.price * product.quantity)} đ</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào trong đơn hàng.</p>
        )}
      </div>
      <div className="rightOrder__total-container">
        <div className="rightOrder__total-container-item">
          <div className="rightOrder__total-container-item-i">
            <p>Tạm tính:</p>
            <p>{formatNumber(price)} đ</p>
          </div>
          <div className="rightOrder__total-container-item-i">
            <p>Phí vận chuyển:</p>
            <p>0 đ</p>
          </div>
        </div>
      </div>
      <div className="rightOrder__total-container">
        <div className=" total-item">
          <p>Tổng cộng:</p>
          <p>{formatNumber(price)} đ</p>
        </div>
      </div>
      <div className="rightOrder__button">
        <p
          className="rightOrder__button-back"
          onClick={() => navigate("/cart")}
        >
          <span>
            <GrFormPrevious />
          </span>
          Quay lại giỏ hàng
        </p>
        <button
          className="rightOrder__button-btn"
          onClick={handleOrder}
          disabled={products.length === 0}
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default RightOrder;
