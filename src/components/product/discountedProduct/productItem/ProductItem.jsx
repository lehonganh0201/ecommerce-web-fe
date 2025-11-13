/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "@/utils/function/validateTime";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import "./ProductItem.scss";
import { getProductById } from "@/apis/product";
import axios from "axios";
import { toast } from "react-toastify";
import { addToCart } from "@/apis/cart";
import { useDispatch, useSelector } from "react-redux";
import { setQuantityOfCart } from "@/store/orderSlice";

const ProductItem = ({ product }) => {
  const [indexImage, setIndexImage] = useState(0);
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [likeProducts, setLikeProducts] = useState(
    JSON.parse(localStorage.getItem("likeProducts")) || []
  );

  const dispatch = useDispatch();
  const quantityOfCart = useSelector((state) => state.order.quantityOfCart);

  useEffect(() => {
    setLikeProducts(JSON.parse(localStorage.getItem("likeProducts")) || []);
  }, [isFetching]);

  const isLiked = (product) => {
    return likeProducts.some((item) => item.id === product.id);
  };

  const handleLike = (product) => {
    setIsFetching(!isFetching);
    const isLike = isLiked(product);

    if (isLike) {
      const updatedLikeProducts = likeProducts.filter(
        (item) => item.id !== product.id
      );
      localStorage.setItem("likeProducts", JSON.stringify(updatedLikeProducts));
      toast.info("Đã xóa sản phẩm khỏi danh sách yêu thích");
    } else {
      const updatedLikeProducts = [...likeProducts, product];
      localStorage.setItem("likeProducts", JSON.stringify(updatedLikeProducts));
      toast.success("Đã thêm sản phẩm vào danh sách yêu thích");
    }
  };

  const handleClickAddToCart = async (e) => {
  e.stopPropagation();

  const accessToken = localStorage.getItem("accessToken");
  const quantityToAdd = 1; 
  const selectedVariant =
    product.variants?.[0] || product;

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

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="product-item"
    >
      <div
        className={`product-item_following ${isLiked(product) ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isLiked(product) ? (
          <FaHeart
            color="red" 
            onClick={() => handleLike(product)}
          />
        ) : (
          <FaRegHeart
            color="#555" 
            onClick={() => handleLike(product)}
          />
        )}
      </div>

      <div className="product-item_img">
        {product.images?.length > indexImage && (
          <img src={product.images[indexImage].image} alt={product.name} />
        )}
      </div>

      <button
        className="product-item_add-to-card"
        onClick={(e) => handleClickAddToCart(e)}
      >
        Thêm vào giỏ hàng
      </button>

      <div className="product-item_img-list">
        {product.images?.map((image, index) => (
          <div
            onMouseEnter={() => setIndexImage(index)}
            key={index}
            className={`product-item_img-list-item ${
              index === indexImage ? "active" : ""
            }`}
          >
            <img src={image.image} alt={product.name} />
          </div>
        ))}
      </div>

      <p className="product-item_name">{product.name}</p>

      <div className="product-item_price">
        <p className="product-item_price-fake">
          {formatNumber(product.basePrice)} đ
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
