/* eslint-disable */
import React, { useEffect, useState } from "react";
import { MdOutlineAccountCircle } from "react-icons/md";
import { toast } from "react-toastify";
import "./Information.scss";
import { getMe, uploadAvatar } from "@/apis/user";

const Infomation = () => {
  const [isEditting, setIsEditing] = useState(false);
  const [information, setInformation] = useState({
    username: "",
    firstName: "",
    email: "",
    lastName: "",
  });
  const [avatar, setAvatar] = useState(null); 
  const [uploading, setUploading] = useState(false); 

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await getMe();
        setInformation((prev) => ({
          ...prev,
          username: response.data.username || "",
          firstName: response.data.fullName.split(" ")[0] || "",
          lastName:
            response.data.fullName.split(" ").slice(1).join(" ") || "",
          email: response.data.email || "",
        }));
        if (response.data.avatar) {
          setAvatar(response.data.avatar);
        }
      } catch (error) {
        console.log("Error fetching user information:", error);
        toast.error("Lỗi khi lấy thông tin người dùng");
      }
    };
    fetchUserInformation();
  }, []);

  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("File quá lớn! Dung lượng tối đa 1MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Chỉ chấp nhận file ảnh (.jpg, .png, .jpeg).");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);

      setUploading(true);
      try {
        const response = await uploadAvatar(file);
        toast.success("Upload avatar thành công!");
        const updatedUser = await getMe();
        if (updatedUser.data.avatar) {
          setAvatar(updatedUser.data.avatar);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload avatar thất bại!");
        setAvatar(null);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    }
  };

  const handleChangeInformation = (e) => {
    const { name, value } = e.target;
    setInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="information" data-aos="fade-right">
      <h1 className="information__title">Hồ sơ của tôi</h1>
      <p className="information__description">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>
      <hr />
      <div className="information__content">
        <div className="information__content__form">
          <div className="information__content__form__item">
            <p>Tên đăng nhập</p>
            <input
              type="text"
              value={information.username}
              disabled={!isEditting}
              name="username"
              onChange={(e) => handleChangeInformation(e)}
            />
          </div>
          <div className="information__content__form__item">
            <p>Họ</p>
            <input
              type="text"
              value={information.firstName}
              name="firstName"
              onChange={(e) => handleChangeInformation(e)}
              disabled={!isEditting}
            />
          </div>
          <div className="information__content__form__item">
            <p>Tên</p>
            <input
              type="text"
              value={information.lastName}
              name="lastName"
              onChange={(e) => handleChangeInformation(e)}
              disabled={!isEditting}
            />
          </div>
          <div className="information__content__form__item">
            <p>Email</p>
            <input
              type="email"
              value={information.email}
              name="email"
              disabled={!isEditting}
              onChange={(e) => handleChangeInformation(e)}
            />
          </div>
          <div className="information__content__form__btn">
            {!isEditting ? (
              <button
                onClick={() => setIsEditing(true)}
                className="information__content__form__btn-edit"
              >
                Chỉnh sửa
              </button>
            ) : (
              <div className="information__content__form__btn__group">
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="information__content__form__btn__group-save"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="information__content__form__btn__group-cancel"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="information__content__avatar">
          <div className="information__content__avatar__img">
            {avatar ? (
              <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            ) : (
              <MdOutlineAccountCircle />
            )}
          </div>
          <label htmlFor="file" className="information__content__avatar__label">
            <input
              type="file"
              id="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleChangeAvatar(e)}
              disabled={uploading}
            />
            <span>{uploading ? "Đang upload..." : "Chọn ảnh đại diện"}</span>
          </label>
          <p>Dung lượng tối đa 1MB. Định dạng: .jpg, .png, .jpeg</p>
        </div>
      </div>
    </div>
  );
};

export default Infomation;