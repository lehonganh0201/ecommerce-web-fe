/* eslint-disable */
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { ImHeadphones } from "react-icons/im";
import { FiPackage } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";
import { PiHandCoinsFill } from "react-icons/pi";
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
  const [likeProducts, setLikeProducts] = useState(
    JSON.parse(localStorage.getItem("likeProducts")) || []
  );

  useEffect(() => {
    const fetchVariants = async () => {
      const res = await getVariantsByProductId(product.id);
      setVariants(res.data || []);
    };

    if (product?.id) fetchVariants();
  }, [product?.id]);

  const dispatch = useDispatch();
  const orderListProducts = useSelector((state) => state.order.orderList || []);
  const quantityOfCart = useSelector((state) => state.order.quantityOfCart);
  const navigate = useNavigate();

  // --- Kiểm tra xem sản phẩm này đã yêu thích chưa ---
  const isLiked = likeProducts.some((item) => item.id === product.id);

  const handleLike = () => {
    let updatedLikeProducts;
    if (isLiked) {
      updatedLikeProducts = likeProducts.filter((item) => item.id !== product.id);
      toast.info("Đã xóa khỏi danh sách yêu thích");
    } else {
      updatedLikeProducts = [...likeProducts, product];
      toast.success("Đã thêm vào danh sách yêu thích");
    }
    setLikeProducts(updatedLikeProducts);
    localStorage.setItem("likeProducts", JSON.stringify(updatedLikeProducts));
  };

  const handleClickAddToCart = async (e) => {
    e.stopPropagation();

    const accessToken = localStorage.getItem("accessToken");
    const quantityToAdd = Number(infoSelect.quantity) || 1;
    const selectedVariant =
      variants.find(
        (v) => v.id === infoSelect.variantId || v._id === infoSelect.variantId
      ) || variants[0];

    if (!selectedVariant) {
      toast.error("Không tìm thấy biến thể sản phẩm");
      return;
    }

    try {
      if (accessToken) {
        const data = {
          variantId: selectedVariant.id || selectedVariant._id,
          quantity: quantityToAdd,
        };

        await addToCart(data);
        dispatch(setQuantityOfCart(quantityOfCart + quantityToAdd));
        toast.success("Thêm sản phẩm vào giỏ hàng thành công");
      } else {
        const productCart = {
          id: product.id,
          productName: product.name,
          imageUrl:
            selectedVariant.imageUrl ||
            selectedVariant.images?.[0]?.image ||
            product.images?.[0]?.image,
          variantId: selectedVariant.id || selectedVariant._id,
          quantity: quantityToAdd,
          price: selectedVariant.price || product.basePrice,
          stock: selectedVariant.stock || selectedVariant.stockQuantity,
          addedAt: new Date().toISOString(),
        };

        let localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = localCart.findIndex(
          (item) => item.variantId === productCart.variantId
        );

        if (existingIndex > -1) {
          localCart[existingIndex].quantity += productCart.quantity;
        } else {
          localCart.push(productCart);
        }

        localStorage.setItem("cart", JSON.stringify(localCart));

        const totalQuantity = localCart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        dispatch(setQuantityOfCart(totalQuantity));

        toast.success("Thêm sản phẩm vào giỏ hàng thành công");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        navigate("/auth");
      } else {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng");
      }
    }
  };

  const handleClickBuy = async () => {
    const variantId = infoSelect.variantId || variants[0]._id;
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

  const handleSearchSimilar = () => {
    const productName = product.name || "sản phẩm";
    const encodedQuery = encodeURIComponent(productName);
    navigate(`/search?searchKeyword=${encodedQuery}`);
  };


  return (
    <div className="right-session">
      <div className="right-session__product-name">
        <h1>{product.name}</h1>
        <div
          className={`right-session__product-name__icons ${isLiked ? "liked" : ""
            }`}
          onClick={handleLike}
        >
          {isLiked ? (
            <FaHeart color="#ff4d4f" fontSize='24px' />
          ) : (
            <FaRegHeart color="#555" fontSize='24px' />
          )}
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
                  className={`${infoSelect.type === attribute.value ? "active" : ""
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
          <div className="search" onClick={handleSearchSimilar}>
            <p>Tìm kiếm sản phẩm tương tự</p>
          </div>
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
