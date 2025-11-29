/* eslint-disable */
import React from "react";
import { MdCancel } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa6";
import { formatNumber } from "@/utils/function/validateTime";

import "./CartItem.scss";
import { useNavigate } from "react-router-dom";

const CartItem = ({
  setListProducts,
  product,
  setSelectedProducts,
  selectedProducts,
  variantIds,
  index,
  isLogin,
  updateLocalCart,
}) => {
  const detail = product.detail;
  console.log("product item cart", product);
  const navigate = useNavigate();

  const handleIncrease = (variantId) => {
    setListProducts((prev) => {
      const newList = prev.map((p) =>
        p.variantId === variantId
          ? { ...p, quantity: p.quantity + 1 }
          : p
      );
      if (!isLogin) {
        updateLocalCart(newList);
      }
      // TODO: Nếu đã login, gọi API update quantity cho variantId
      return newList;
    });

    setSelectedProducts((prev) => {
      return prev.map((p) =>
        p.variantId === variantId
          ? { ...p, quantity: p.quantity + 1 }
          : p
      );
    });
  };

  const handleDecrease = (variantId) => {
    setListProducts((prev) => {
      const newList = prev.map((p) =>
        p.variantId === variantId && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      );
      if (!isLogin) {
        updateLocalCart(newList);
      }
      // TODO: Nếu đã login, gọi API update quantity cho variantId
      return newList;
    });

    setSelectedProducts((prev) => {
      return prev.map((p) =>
        p.variantId === variantId && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      );
    });
  };

  const handleQuantityChange = (e, variantId) => {
    const newQuantity = Math.max(1, parseInt(e.target.value, 10)); // Đảm bảo số lượng luôn >= 1
    setListProducts((prev) => {
      const newList = prev.map((p) =>
        p.variantId === variantId
          ? { ...p, quantity: newQuantity }
          : p
      );
      if (!isLogin) {
        updateLocalCart(newList);
      }
      // TODO: Nếu đã login, gọi API update quantity cho variantId
      return newList;
    });

    setSelectedProducts((prev) => {
      return prev.map((p) =>
        p.variantId === variantId
          ? { ...p, quantity: newQuantity }
          : p
      );
    });
  };

  const handleClickCheckbox = (variantId) => {
    setSelectedProducts((prev) => {
      const newProducts = [...prev];
      const index = newProducts.findIndex(
        (p) => p.variantId === variantId
      );
      if (index === -1) {
        // Clone product để tránh reference issue
        newProducts.push({ ...product });
      } else {
        newProducts.splice(index, 1);
      }
      return newProducts;
    });
  };

  const handleClickDelete = (variantId) => {
    setListProducts((prev) => {
      const newList = prev.filter((p) => p.variantId !== variantId);
      if (!isLogin) {
        updateLocalCart(newList);
      }
      // TODO: Nếu đã login, gọi API remove item từ cart (e.g., removeFromCart(variantId))
      return newList;
    });

    setSelectedProducts((prev) =>
      prev.filter((p) => p.variantId !== variantId)
    );
  };

  // Fix: Navigate đến search với query tên sản phẩm
  const handleSearchSimilar = () => {
    const productName = detail?.name || product.name || "sản phẩm";  // Fallback nếu không có name
    const encodedQuery = encodeURIComponent(productName);  // Encode để URL safe
    navigate(`/search?searchKeyword=${encodedQuery}`);
  };

  return (
    <div className="card-item">
      <div className="card-item__left">
        <input
          type="checkbox"
          checked={selectedProducts?.some(
            (p) => p.variantId === product.variantId
          )}
          onChange={() => handleClickCheckbox(product.variantId)}
        />

        {/* Ảnh sản phẩm */}
        <img
          src={detail?.images?.[0]?.image || product.images?.[0] || "/images/default-product.png"}
          alt={detail?.name || product.name || "product"}
        />
        <div className="card-item__left-info">
          <h3>{detail?.name || product.name}</h3>

          {product.attributes &&
            product.attributes.map((attribute, index) => (
              <p key={index}>
                {attribute.type}: {attribute.value}
              </p>
            ))}
          <p className="price">
            {/* Gia cua mot san pham */}
            <span className="sale">{formatNumber(product.price)} đ</span>
            {/* <span className="real">{formatNumber(product.price)} đ</span> */}
          </p>
          <div className="quantity">
            <button onClick={() => handleDecrease(product.variantId)}>-</button>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => handleQuantityChange(e, product.variantId)}
              min="1" // Đảm bảo số lượng không nhỏ hơn 1
            />
            <button onClick={() => handleIncrease(product.variantId)}>+</button>
          </div>
          <p className="price__res">
            {formatNumber(product.quantity * product.price)} đ
          </p>
        </div>
      </div>

      <div className="card-item__right">
        <p className="price">
          {formatNumber(product.quantity * product.price)} đ
        </p>
        <div className="card-item__right-search">
          <MdCancel
            className="icon-cancel"
            onClick={() => handleClickDelete(product.variantId)}
          />
          <div className="search" onClick={handleSearchSimilar}>
            <p>Tìm kiếm sản phẩm tương tự</p>
            <FaCaretDown className="icon-down" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;