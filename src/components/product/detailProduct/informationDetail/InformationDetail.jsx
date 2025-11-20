/* eslint-disable */
import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";

import "./InformationDetail.scss";
import axios from "axios";
import { getAvgRatingByProductId, getReviewsByProductId } from "@/apis/review";
import { getVariantsByProductId } from "@/apis/variant";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// const [ratingAvgRes, reviewsRes] = await Promise.all([
//   // getAvgRatingByProductId(product.id),
//   getReviewsByProductId(reviewParams),
// ]);

const InformationDetail = ({
  product,
  setIsShowAddComment,
  isShowAddComment,
}) => {
  const [typeMenu, setTypeMenu] = useState("info");
  const [rate, setRate] = useState(0);
  const [comments, setComments] = useState({
    averageRating: 0,
    reviews: [],
    totalReviews: 0, // Đảm bảo có field này nếu API trả về
  });
  const [variants, setVariants] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchRateAndComments = async () => {
      try {
        const reviewParams = {
          productId: BigInt(product.id),
          page: 0,
          size: 20,
          sort: "createdAt",
          direction: "desc",
        };

        const res = await getReviewsByProductId(reviewParams);
        // setRate(ratingAvgRes.data.averageRating || 0);
        console.log("API response:", res); // Kiểm tra dữ liệu API
        setComments({
          averageRating: res.data?.averageRating || 0,
          reviews: res.data?.reviews || [],
          totalReviews: res.data?.totalReviews || 0,
        });
        setRate(res.data?.averageRating || 0);

        console.log("Fetched comments:", comments);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 500:
              toast.error("Lỗi hệ thống");
              break;
            case 404:
              toast.error("Sản phẩm không tồn tại");
              break;
            default:
              toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
          }
        }
      }
    };

    fetchRateAndComments();
  }, [product, isShowAddComment]);

  // LẤY LIST VARIANTS
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        if (!product?.id) return;

        const res = await getVariantsByProductId(product.id);
        setVariants(res.data);
      } catch (err) {
        console.log("Error fetching variants:", err);
      }
    };

    fetchVariants();
  }, [product]);
  // console.log(variants);
  // console.log("review", comments.reviews);

  useEffect(() => {
    if (comments && comments.averageRating != null) {
      setRate(comments.averageRating);
    }
  }, [comments]);
  const handleClickAddComment = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này");
      navigate("/auth");
      return;
    } else {
      setIsShowAddComment(true);
    }
  };

  // Fix: Chỉ hiển thị nút nếu product.canReview === true (người dùng có quyền review)
  // Bỏ logic cũ dựa trên totalReviews, vì nút nên dựa vào quyền review cá nhân
  const shouldShowAddCommentButton = product.canReview === true;

  return (
    <div className="infomation">
      <div data-aos="fade-up" className="infomation-menu">
        <ul className="infomation-menu__list">
          <li
            className={`${typeMenu === "info" ? "active" : ""}`}
            onClick={() => setTypeMenu("info")}
          >
            Thông tin sản phẩm
          </li>
          <li
            className={`${typeMenu === "exchangePolicy" ? "active" : ""}`}
            onClick={() => setTypeMenu("exchangePolicy")}
          >
            Chính sách đổi trả
          </li>
          <li
            className={`${typeMenu === "comment" ? "active" : ""}`}
            onClick={() => setTypeMenu("comment")}
          >
            Đánh giá sản phẩm
          </li>
        </ul>
      </div>
      {typeMenu === "info" && (
        <div data-aos="fade-up" className="info">
          {product.description}
          {/* HIỂN THỊ THUỘC TÍNH VARIANTS */}
          {variants?.length > 0 && (
            <div className="product-attributes">
              <table className="attributes-table">
                <tbody>
                  <tr>
                    <td className="attr-name">Mã sản phẩm</td>
                    <td className="attr-name">{variants[0].id}</td>
                  </tr>
                  {Array.from(
                    new Map(
                      variants[0].variantAttributes.map((attr) => [
                        attr.name,
                        attr,
                      ])
                    ).values()
                  ).map((attr) => (
                    <tr key={attr.name}>
                      <td className="attr-name">{attr.name}</td>
                      <td className="attr-value">{attr.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {typeMenu === "comment" &&
        (comments.reviews.length === 0 ? (
          <div data-aos="fade-up" className="comment__no">
            Chưa có đánh giá nào
            {shouldShowAddCommentButton && (
              <div className="comment__have__write">
                <button onClick={handleClickAddComment}>Viết đánh giá</button>
              </div>
            )}
          </div>
        ) : (
          <div data-aos="fade-up" className="comment__have">
            {/* <h1>{product.name}</h1>
            <h1>{product.id}</h1> */}
            <div className="comment__have__rate">
              {/* <div className="comment__have__rate__star">
                <span className="comment__have__rate-number">{rate}</span>
                <span>
                  {Array.from({ length: Math.floor(rate) }, (_, i) => (
                    <FaStar key={i} />
                  ))}
                  {rate % 1 !== 0 && <FaRegStarHalfStroke />}
                  {Array.from({ length: 5 - Math.ceil(rate) }, (_, i) => (
                    <FaRegStar key={i} />
                  ))}
                </span>
              </div> */}
              <div className="comment__have__rate__star">
                <span className="comment__have__rate-number">{rate}</span>
                <span>
                  {/* Sao đầy */}
                  {Array.from({ length: Math.floor(rate) }, (_, i) => (
                    <FaStar key={`full-${i}`} />
                  ))}
                  {/* Sao nửa nếu có */}
                  {rate % 1 !== 0 && <FaRegStarHalfStroke key="half" />}
                  {/* Sao rỗng */}
                  {Array.from({ length: 5 - Math.ceil(rate) }, (_, i) => (
                    <FaRegStar key={`empty-${i}`} />
                  ))}
                </span>
              </div>
              <div className="comment__have__rate-count">
                <span>{comments.totalReviews || comments.reviews.length}</span> Đánh giá
              </div>
            </div>
            <div className="comment__have__list">
              {comments.reviews.map((comment, index) => (
                <div className="comment__have__item" key={index}>
                  <img
                    src={comment.avatar || "/person.png"}
                    alt={comment.name || ""}
                  />
                  <div className="comment__have__item-content">
                    <p className="name">{comment.fullName}</p>
                    <div className="rating">
                      {Array.from({ length: comment.rating }, (_, i) => (
                        <FaStar key={i} />
                      ))}
                      {Array.from({ length: 5 - comment.rating }, (_, i) => (
                        <FaRegStar key={i} />
                      ))}
                    </div>
                    <p className="content">{comment.comment}</p>
                    {/* Phần hiển thị ảnh đánh giá nếu có */}
                    {comment.image && (
                      <div className="comment__review-image">
                        <img
                          src={comment.image}
                          alt="Ảnh đánh giá"
                          className="review-image"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {shouldShowAddCommentButton && (
              <div className="comment__have__write">
                <button onClick={handleClickAddComment}>Viết đánh giá</button>
              </div>
            )}
          </div>
        ))}
      {/* {typeMenu === "comment" && (
        <>
          {comments.length > 0 ? (
            comments.map((review) => (
              <div key={review.id}>
                <p>{review.comment}</p>
                <p>Rating: {review.rating}</p>
                <p>By: {review.fullName}</p>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá nào</p>
          )}
        </>
      )} */}

      {typeMenu === "exchangePolicy" && (
        <div data-aos="fade-up" className="exchangePolicy">
          <div className="policy-item">
            <h4>Đổi trả</h4>
            <p>
              Quý khách có thể đổi hoặc trả sản phẩm trong vòng 14 ngày kể từ
              ngày nhận hàng. Sản phẩm phải còn nguyên tem, nhãn mác, chưa qua
              sử dụng và còn đầy đủ bao bì.
            </p>
          </div>

          <div className="policy-item">
            <h4>Bảo hành</h4>
            <p>
              Sản phẩm được bảo hành 12 tháng đối với các lỗi kỹ thuật từ nhà
              sản xuất. Các lỗi do người dùng gây ra sẽ không được bảo hành.
            </p>
          </div>

          <div className="policy-item">
            <h4>Vận chuyển</h4>
            <p>
              Hỗ trợ giao hàng trên toàn quốc. Miễn phí vận chuyển cho đơn hàng
              trên 500.000₫. Thời gian giao hàng dự kiến từ 2-5 ngày làm việc
              tùy khu vực.
            </p>
          </div>

          <div className="policy-item">
            <h4>Hỗ trợ khách hàng</h4>
            <p>
              Quý khách vui lòng liên hệ hotline: 1900 1234 hoặc email:
              support@shop.com.vn để được hỗ trợ nhanh nhất.
            </p>
          </div>

          <div className="policy-item">
            <h4>Khuyến mãi & quà tặng</h4>
            <p>
              Các chương trình khuyến mãi và quà tặng đi kèm sản phẩm chỉ áp
              dụng trong thời gian diễn ra chương trình. Không áp dụng đồng thời
              với các chương trình giảm giá khác.
            </p>
          </div>

          <div className="policy-item">
            <h4>Lưu ý quan trọng</h4>
            <p>
              Sản phẩm giảm giá sâu, hàng outlet, hoặc sản phẩm đã qua khuyến
              mãi đặc biệt có thể không được đổi trả. Vui lòng đọc kỹ điều kiện
              trước khi mua.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationDetail;