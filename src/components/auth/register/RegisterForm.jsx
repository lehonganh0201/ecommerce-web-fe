/* eslint-disable */
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";

import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { registerValidationSchema } from "@/utils/validation/authValidation";
import { FcGoogle } from "react-icons/fc";

import "./RegisterForm.scss";
import { register } from "@/apis/auth";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ setIsLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initiateValues = {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    isMale: true,
    dateOfBirth: "",
  };

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const data = {
      username: values.userName,
      password: values.password,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      isMale: values.isMale,
      dateOfBirth: values.dateOfBirth,
    };

    try {
      await register(data);
      toast.success("Đăng ký thành công. Mời bạn xác nhận OTP!");
      navigate("/verifyOTP", { state: { email: data.email } });
      setIsLogin(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("Email hoặc tên đăng nhập đã tồn tại");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  return (
    <div data-aos="fade-right" className={`register `}>
      <h1>Đăng ký</h1>
      <div className="register-form">
        <Formik
          initialValues={initiateValues}
          validationSchema={registerValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, errors, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="register-form_item">
                <label className="register-form_title" htmlFor="firstName">
                  Họ
                </label>
                <Field
                  className="register-form_input"
                  type="text"
                  name="firstName"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="register-form_item">
                <label className="register-form_title" htmlFor="lastName">
                  Tên
                </label>
                <Field
                  className="register-form_input"
                  type="text"
                  name="lastName"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="register-form_item">
                <label className="register-form_title" htmlFor="email">
                  Email
                </label>
                <Field
                  className="register-form_input"
                  type="email"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="register-form_item">
                <label className="register-form_title" htmlFor="phoneNumber">
                  Số điện thoại
                </label>
                <Field
                  className="register-form_input"
                  type="text"
                  name="phoneNumber"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="register-form_item">
                <label className="register-form_title" htmlFor="email">
                  Giới tính
                </label>
                <Field
                  as="select"
                  className="register-form_input"
                  name="isMale"
                >
                  <option value={true}>Nam</option>
                  <option value={false}>Nữ</option>
                </Field>
                <ErrorMessage
                  name="isMale"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="register-form_item">
                <label className="register-form_title" htmlFor="dateOfBirth">
                  Ngày sinh
                </label>
                <Field
                  className="register-form_input"
                  type="date"
                  name="dateOfBirth"
                />
                <ErrorMessage
                  name="dateOfBirth"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="register-form_item">
                <label className="register-form_title" htmlFor="userName">
                  Tên đăng nhập
                </label>
                <Field
                  className="register-form_input"
                  type="text"
                  name="userName"
                />
                <ErrorMessage
                  name="userName"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="register-form_item password">
                <label className="register-form_title" htmlFor="password">
                  Mật khẩu
                </label>
                <Field
                  className="register-form_input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
                {showPassword ? (
                  <FaRegEye
                    className="eye"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEyeSlash
                    className="eye"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              <div className="register-form_item password">
                <label
                  className="register-form_title"
                  htmlFor="confirmPassword"
                >
                  Xác nhận lại mật khẩu
                </label>
                <Field
                  className="register-form_input"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
                {showConfirmPassword ? (
                  <FaRegEye
                    className="eye"
                    onClick={() => showConfirmPassword(false)}
                  />
                ) : (
                  <FaEyeSlash
                    className="eye"
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>

              <button type="submit">Đăng ký</button>
              <p>
                Bạn đã có tài khoản?{" "}
                <span onClick={() => setIsLogin(true)}>Đăng nhập</span>
              </p>
              <p>Hoặc</p>
              <div className="login-gg">
                <button>
                  <FcGoogle />
                  <p>Đăng nhập bằng Google</p>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterForm;
