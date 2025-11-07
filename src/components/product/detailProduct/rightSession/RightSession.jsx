/* eslint-disable */
import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { ImHeadphones } from "react-icons/im";
import { FiPackage } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";
import { PiHandCoinsFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa6";

import "./RightSession.scss";
import { formatNumber } from "@/utils/function/validateTime";
import { addToCart } from "@/apis/cart";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrderList, setQuantityOfCart } from "@/store/orderSlice";
import { getVariantsByProductId } from "@/apis/variant";

const RightSession = ({ product }) => {
  const [infoSelect, setInfoSelect] = useState({
    type: 0,
    quantity: "1",
  });
  const [variants, setVariants] = useState([]);

  useEffect(() => {
  const fetchVariants = async () => {
    const res = await getVariantsByProductId(product.id);
    setVariants(res.data || []);
  };

  if (product?.id) fetchVariants();
}, [product?.id]);
  const [isLike, setIsLike] = useState(false);
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch();
  const orderListProducts = useSelector((state) => state.order.orderList || []);
  const quantityOfCart = useSelector((state) => state.order.quantityOfCart);
  console.log('product', product)

  const benefits = [
    {
      icon: <ImHeadphones />,
      title: "Giao hàng toàn quốc",
      desc: "Thanh toán (COD) khi nhận hàng",
    },
    {
      icon: <FiPackage />,
      title: "Miễn phí giao hàng",
      desc: "Theo chính sách",
    },
    {
      icon: <FaTruck />,
      title: "Đổi trả trong 7 ngày",
      desc: "Kể từ ngày giao hàng",
    },
    {
      icon: <PiHandCoinsFill />,
      title: "Hỗ trợ 24/7",
      desc: "Theo chính sách",
    },
  ];

  const navigate = useNavigate();

const handleClickAddToCart = async (e) => {
  e.stopPropagation();

  const checkToken = localStorage.getItem("accessToken");
  const quantityToAdd = Number(infoSelect.quantity) || 1;

  try {
    if (checkToken) {
      const data = {
        variantId: infoSelect.variantId || product.variants[0].id,
        quantity: quantityToAdd,   // ✅ lấy theo input
      };

      await addToCart(data);
      dispatch(setQuantityOfCart(quantityOfCart + quantityToAdd));
      toast.success("Thêm sản phẩm vào giỏ hàng thành công");

    } else {
      const selectedVariant = product.variants.find(
        (v) => v.id === infoSelect.variantId || v._id === infoSelect.variantId
      ) || product.variants[0];

      const productCart = {
        id: product.id,
        productName: product.name,
        imageUrl: selectedVariant.imageUrl,
        variantId: selectedVariant.id || selectedVariant._id,
        quantity: quantityToAdd,  // ✅ lấy số lượng nhập
        price: selectedVariant.price || product.price,
        stock: selectedVariant.stock,
        variant: selectedVariant,
        addedAt: new Date().toISOString(),
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const checkItemIndex = cart.findIndex(i => i.variantId === productCart.variantId);

      if (checkItemIndex > -1) {
        cart[checkItemIndex].quantity += productCart.quantity;
      } else {
        cart.push(productCart);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
      dispatch(setQuantityOfCart(totalQuantity));

      toast.success("Thêm sản phẩm vào giỏ hàng thành công");
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    toast.error("Không thể thêm sản phẩm vào giỏ hàng");
  }
};



  const handleClickBuy = async () => {
    const variantId = infoSelect.variantId || product.variants[0]._id;
    const quantityToAdd = Number(infoSelect.quantity) || 1;

    const existingProduct = orderListProducts.find(
      (item) => item.variantId === variantId
    );

    let updatedProducts;

    if (!existingProduct) {
      const newProduct = {
        ...product,
        variantId,
        quantity: quantityToAdd,
      };
      updatedProducts = [...orderListProducts, newProduct];
    } else {
      updatedProducts = orderListProducts.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      );
    }

    dispatch(setOrderList(updatedProducts));
    await handleClickAddToCart();
    navigate("/cart");
  };
  

  return (
    <div className="right-session">
      <div className="right-session__product-name">
        <h1>{product.name}</h1>
        <div className="right-session__product-name__icons">
          {isLike ? (
            <FaHeart
              onClick={() => setIsLike(!isLike)}
              style={{ fontSize: "24px", cursor: "pointer", color: "#ff6347" }}
            />
          ) : (
            <FaRegHeart
              onClick={() => setIsLike(!isLike)}
              style={{ fontSize: "24px", cursor: "pointer" }}
            />
          )}
          {/* <button>{product.status}</button> */}
        </div>
      </div>
      <div className="right-session__price">
        <span className={`right-session__price__sale `}>
          {/* {formatNumber(product.price * (1 - product.discount / 100))} đ */}
          {infoSelect?.price
            ? formatNumber(infoSelect?.price)
            : formatNumber(product?.basePrice)}{" "}
          đ
        </span>
        {/* <span className="right-session__price__real">
          {formatNumber(product.price)} đ
        </span> */}
      </div>
      <div className="right-session__type">
        <p>Phân loại</p>
        <div className="right-session__type__buttons">
          {product?.variants?.map(
            (type, index) =>
              type.attributes &&
              type.attributes.map((attribute, attrIndex) => (
                <button
                  onClick={() =>
                    setInfoSelect({
                      ...infoSelect,
                      type: attribute.value,
                      price: type.price,
                      variantId: type._id,
                      stock: type.stock
                    })
                  }
                  key={attrIndex}
                  className={`${
                    infoSelect.type === attribute.value ? "active" : ""
                  }`}
                >
                  {attribute.value}
                </button>
              ))
          )}
        </div>
      </div>
      <div className="right-session__quantity-group">
        <p>Tồn kho: {infoSelect?.stock ?? variants[0]?.stockQuantity}</p> 
        <p>Số lượng</p>
        <div className="right-session__quantity-group__quantity">
          <div className="right-session__quantity-group__quantity-buttons">
            <button
              onClick={() =>
                setInfoSelect({
                  ...infoSelect,
                  quantity:
                    Number(infoSelect.quantity) > 1
                      ? Number(infoSelect.quantity) - 1
                      : 1,
                })
              }
            >
              -
            </button>
            <input
              name="quantity"
              value={infoSelect.quantity}
              onChange={(e) =>
                setInfoSelect({ ...infoSelect, quantity: e.target.value })
              }
            />
            <button
              onClick={() =>
                setInfoSelect({
                  ...infoSelect,
                  quantity: Number(infoSelect.quantity) + 1,
                })
              }
            >
              +
            </button>
          </div>
          <p>Tìm kiếm sản phẩm tương tự</p>
        </div>
      </div>
      <div className="right-session__button">
        <button
          className="right-session__button-add"
          onClick={(e) => handleClickAddToCart(e)}
        >
          Thêm vào giỏ hàng
        </button>
        <button className="right-session__button-buy" onClick={handleClickBuy}>
          Mua ngay
        </button>
      </div>
      <div className="right-session__benefits">
        {benefits.map((benefit, index) => (
          <div key={index} className="right-session__benefits__item">
            <div className="right-session__benefits__icon-item">
              {benefit.icon}
            </div>
            <div className="right-session__benefits__content-item">
              <p className="title-item">{benefit.title} :</p>
              <p className="content-item">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSession;
