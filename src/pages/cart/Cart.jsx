/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { formatNumber } from "@/utils/function/validateTime";
import "./Cart.scss";
import TitleRouter from "@/components/product/titleRouter/TitleRouter";
import Layout from "@/components/commons/layout/Layout";
import CartItem from "@/components/cart/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { setOrderList, setPrice, setQuantityOfCart } from "@/store/orderSlice";
import { getProductsInCart } from "@/apis/cart";
import { getProductByVariantId } from "@/apis/variant";
import { getProductById } from "@/apis/product";

const Cart = () => {
  const [listProducts, setListProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  const selectedProductsFromStore = useSelector(
    (state) => state.order.orderList || []
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [variantIds, setVariantIds] = useState([]);
  const [productIdVariant, setproductIdVariant] = useState([]); // lay gia tri productId từ variant bằng variantID
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    // Kiểm tra trạng thái login
    const token = localStorage.getItem("accessToken");
    setIsLogin(!!token);

    const fetchListProductsInCart = async () => {
      try {
        // Initial selectedProducts = [] để total = 0
        setSelectedProducts([]);

        if (token) {
          // Nếu đã đăng nhập, lấy từ API
          const response = await getProductsInCart();
          const variantIds = response.data.items.map((item) => item.variantId); //  lay list id variant
          setVariantIds(variantIds);
          setListProducts(response.data.items);

          // === Gọi API variant để lấy productId ===
          const variantResList = await Promise.all(
            variantIds.map((id) => getProductByVariantId(id))
          );
          // Loc ra id cua product
          const productIds = variantResList.map((res) => res.data.productId);
          setproductIdVariant(productIds);

          // === 2. Gọi API product để lấy thông tin sản phẩm ===
          const productResList = await Promise.all(
            productIds.map((id) => getProductById(id))
          );
          const productList = productResList.map((res) => res.data);
          setProductDetails(productList);

          // Initial totalPrice = 0 (chưa select gì)
          setTotalPrice(0);
        } else {
          // Nếu chưa đăng nhập, lấy từ localStorage
          const localCart = getLocalCart();
          setListProducts(localCart);
          // Initial selected = [] để total = 0
          setSelectedProducts([]);
          setTotalPrice(0);
        }
      } catch (error) {
        console.log("Error fetching products in cart:", error);

        // Fallback về localStorage nếu API fail
        const localCart = getLocalCart();
        setListProducts(localCart);
        setSelectedProducts([]);
        setTotalPrice(0);
      }
    };

    fetchListProductsInCart();
  }, []);

  // Tính total chỉ khi selectedProducts thay đổi (tăng khi chọn CartItem)
  useEffect(() => {
    let total = 0;
    selectedProducts?.forEach((product) => {
      total += (product.price || 0) * (product.quantity || 0);  // Đảm bảo price/quantity tồn tại
    });
    console.log("Calculated totalPrice:", total, "from selected:", selectedProducts.length);  // DEBUG
    setTotalPrice(total);
  }, [selectedProducts]);

  // Function để lấy cart từ localStorage
  const getLocalCart = () => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  };

  // Function để cập nhật localStorage cart
  const updateLocalCart = (updatedCart) => {
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Cập nhật Redux state
      const totalQuantity = updatedCart.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      dispatch(setQuantityOfCart(totalQuantity));
    } catch (error) {
      console.error("Error updating localStorage cart:", error);
    }
  };

  const handleClickBuy = () => {
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }

    if (!isLogin) {
      toast.error("Bạn cần đăng nhập để thanh toán");
      // Lưu selected products vào localStorage để restore sau khi login
      localStorage.setItem(
        "selectedProductsForCheckout",
        JSON.stringify(selectedProducts)
      );
      navigate("/auth");
      return;
    }

    dispatch(setOrderList(selectedProducts));
    dispatch(setPrice(totalPrice));
    navigate("/order");
  };
  console.log("carrt ", listProducts);
  console.log("Variant IDs:", variantIds);
  console.log("productIdVariant", productIdVariant);
  console.log("productDetails", productDetails);

  return (
    <div>
      <Layout>
        <div className="card-page">
          <TitleRouter title="Giỏ hàng" />
          <div className="card">
            <div className="card-container">
              <h1>Giỏ hàng của bạn</h1>

              {/* Hiển thị thông báo nếu chưa đăng nhập */}
              {!isLogin && listProducts.length > 0 && (
                <div
                  className="guest-notice"
                  style={{
                    background: "#f0f8ff",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  <p>
                    Bạn đang xem giỏ hàng tạm thời.
                    <span
                      onClick={() => navigate("/auth")}
                      style={{
                        color: "#007bff",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                    >
                      Đăng nhập
                    </span>{" "}
                    để lưu giỏ hàng và thanh toán.
                  </p>
                </div>
              )}

              <div className="card-container__list">
                {listProducts.length > 0 ? (
                  listProducts.map((product, index) => (
                    <CartItem
                      key={`${product.variantId || product.id}-${index}`}
                      product={product}
                      index={index}
                      setListProducts={setListProducts}
                      setSelectedProducts={setSelectedProducts}
                      selectedProducts={selectedProducts}
                      isLogin={isLogin}
                      updateLocalCart={updateLocalCart}
                      variantIds={variantIds}
                      productDetails={productDetails}
                    />
                  ))
                ) : (
                  <div
                    className="empty-cart"
                    style={{
                      textAlign: "center",
                      padding: "50px 0",
                      color: "#666",
                    }}
                  >
                    <p>Giỏ hàng của bạn đang trống</p>
                    <button
                      onClick={() => navigate("/")}
                      style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
                )}
              </div>

              {listProducts.length > 0 && (
                <div className="card-container__total">
                  <p>
                    Tổng tiền: <span>{formatNumber(totalPrice)} đ</span>
                  </p>
                  <div className="card-container__total-buttons">
                    <button className="btn1" onClick={() => navigate("/")}>
                      Tiếp tục mua hàng
                    </button>
                    <button className="btn2" onClick={handleClickBuy}>
                      {isLogin ? "Thanh toán ngay" : "Đăng nhập để thanh toán"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Cart;