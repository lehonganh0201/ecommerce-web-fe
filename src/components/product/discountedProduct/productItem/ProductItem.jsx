/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "@/utils/function/validateTime";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // ✅ thêm icon tim đầy
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

  // ✅ kiểm tra xem sản phẩm có trong danh sách yêu thích không
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
    try {
      const productDetails = await getProductById(product.id);

      const data = {
        variantId: productDetails.data.variants[0].id,
        quantity: 1,
      };

      await addToCart(data);
      dispatch(setQuantityOfCart(quantityOfCart + 1));
      toast.success("Thêm sản phẩm vào giỏ hàng thành công 🛒");
    } catch (error) {
      if (error.message === "Bạn cần đăng nhập để thực hiện yêu cầu này.") {
        toast.error(error.message);
        navigate("/auth");
        return;
      }
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("Thông tin sản phẩm không hợp lệ");
            break;
          case 401:
            toast.error("Bạn cần đăng nhập để thực hiện thao tác này");
            navigate("/auth");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.error("Error adding product to cart:", error);
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
