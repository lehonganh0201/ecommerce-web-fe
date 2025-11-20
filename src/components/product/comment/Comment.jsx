import React, { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";

import "./Comment.scss";
import { getAllProducts } from "@/apis/product";
import { getReviewsByProductId } from "@/apis/review";

const Comment = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch comments by product ID
  const fetchComments = async (productId) => {
    try {
      const data = { productId };
      const response = await getReviewsByProductId(data);
      return response.data.content;
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all products and reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = {
          sortedBy: "basePrice",
          sortDirection: "asc",
          page: 0,
          size: 10,
          status: "true",
        };

        const response = await getAllProducts(data);
        const productList = response.data.data || [];

        // Get reviews for each product
        const listReview = await Promise.all(
          productList.map(async (product) => {
            const commentsRaw = await fetchComments(product.id);
            const comments = commentsRaw.map((comment) => ({
              name: comment.fullName,
              comment: comment.comment,
              rating: Math.min(5, comment.rating),
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm4Cp0JO-s03hFKGZ2WgyO4luH1JSSzcB0ZA&s",
              job: "Khách hàng",
            }));

            return {
              product: {
                name: product?.name,
                image: product?.images?.length > 0 ? product?.images : ["", ""],
                canReview: product?.canReview || false,
              },
              comments,
            };
          })
        );

        // Filter out products with reviews and sort by the number of reviews
        const filteredReviews = listReview.filter(
          (review) => review.comments.length > 0
        );
        filteredReviews.sort(
          (a, b) => b.comments.length - a.comments.length
        );

        setProducts(filteredReviews.slice(0, 5));
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="comment">
      <Swiper
        data-aos="fade-up"
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 20000, disableOnInteraction: false }}
        modules={[Autoplay]}
        className="swiper-reviews__list"
      >
        {products.map((review, index) => (
          <SwiperSlide className="swiper-reviews__item" key={index}>
            <div className="swiper-reviews__item-image">
              <img
                src={review.product.image[0].imageUrl}
                alt={review.product.name}
                className="swiper-reviews__item-img"
              />
              {review.product.image[1] && (
                <img
                  src={review.product.image[1]}
                  alt={review.product.name}
                  className="swiper-reviews__item-img image2"
                />
              )}
            </div>

            <div className="swiper-reviews__item-comment">
              <h1 className="swiper-reviews__item-comment-title">
                ĐÁNH GIÁ CỦA KHÁCH HÀNG
              </h1>

              {/* Swiper for reviews */}
              <Swiper
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Autoplay]}
                nested={true}
                className="swiper-comments__list"
              >
                {review.comments.map((comment, index) => (
                  <SwiperSlide className="swiper-comment__item" key={index}>
                    <div className="swiper-comment__item-content">
                      <p className="swiper-comment__item-comment">
                        {comment.comment}
                      </p>
                      <div className="swiper-comment__item-content-rating">
                        <span className="swiper-comment__item-content-rating-star">
                          {Array.from({ length: comment.rating }, (_, i) => (
                            <FaStar key={i} />
                          ))}
                        </span>
                        <span className="swiper-comment__item-content-rating-star">
                          {Array.from(
                            { length: 5 - comment.rating },
                            (_, i) => (
                              <FaRegStar key={i} />
                            )
                          )}
                        </span>
                      </div>
                      <div className="swiper-comment__item-content-avatar">
                        <img
                          src={comment.avatar}
                          alt={comment.name}
                          className="swiper-comment_item-avatar"
                        />
                      </div>
                      <p className="swiper-comment_name">{comment.name}</p>
                      <p className="swiper-comment_job">{comment.job}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Comment;
