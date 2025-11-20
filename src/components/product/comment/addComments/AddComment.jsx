/* eslint-disable */
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { createReview } from "@/apis/review";
import { toast } from "react-toastify";

const AddComment = ({ setIsShowAddComment, productId, onReviewSubmitted }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      // Tạo preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast.error("Vui lòng chọn file ảnh hợp lệ");
    }
  };

  // Cleanup preview URL để tránh memory leak
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAddComment = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Vui lòng chọn số sao đánh giá từ 1 đến 5");
      return;
    }
    if (comment.trim() === "") {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', comment.trim());
      formData.append('productId', productId);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await createReview(formData);
      toast.success("Đánh giá đã được gửi thành công!");
      
      // Clear states
      setComment("");
      setRating(0);
      setSelectedImage(null);
      setPreviewUrl(null);
      setIsShowAddComment(false);
      
      // Callback để parent reload reviews nếu cần
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[500px] pb-[50px] h-auto z-20 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="w-full h-[70px] flex items-center justify-between px-4 border-b">
        <div></div>
        <p className="text-[20px] font-bold">Thêm đánh giá</p>
        <IoMdClose
          className="w-[20px] h-[20px] cursor-pointer"
          onClick={() => setIsShowAddComment(false)}
        />
      </div>

      {/* Nội dung */}
      <div className="w-full mt-[20px] flex flex-col items-center gap-4 px-[20px]">
        <img
          src="https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg"
          alt="account"
          className="w-[100px] h-[100px] rounded-full"
        />

        {/* Rating sao */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                (hoverRating || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Upload ảnh */}
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block text-center px-4 py-2 border border-dashed border-gray-300 rounded bg-gray-50 mb-2">
            Chọn ảnh
          </label>
          {previewUrl && (
            <div className="w-full text-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-[200px] max-h-[200px] object-cover rounded border"
              />
            </div>
          )}
        </div>

        {/* Nhập đánh giá */}
        <div className="w-full flex gap-[10px] items-center">
          <input
            placeholder="Nhập nội dung đánh giá"
            type="text"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="w-full h-[50px] px-[10px] border border-gray-200 rounded-[5px] shadow-lg outline-none focus:outline-blue-200 focus:ring-1"
          />
          <IoSend
            onClick={handleAddComment}
            disabled={isSubmitting}
            className={`w-[30px] h-[30px] cursor-pointer transition-colors ${
              isSubmitting ? "text-gray-400" : "text-blue-700 hover:text-blue-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default AddComment;