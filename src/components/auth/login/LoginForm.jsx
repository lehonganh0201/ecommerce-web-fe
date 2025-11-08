/* eslint-disable */
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginValidationSchema } from "@/utils/validation/authValidation";
import ForgotPassword from "../forgotPassword/ForgotPassword";

import "./LoginForm.scss";
import { login } from "@/apis/auth";

const LoginForm = ({ setIsLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFogotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const initiateValues = {
    usernameOrEmail: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      };
      const response = await login(data);
      // const user = await getMe();
      // localStorage.setItem("fullName", user.data.fullName);
      // if (localStorage.getItem("roles")?.includes("ADMIN")) {
      //   navigate("/admin/*");
      // } else {
      //   navigate("/admin");
      // }
        navigate("/");
      toast.success("Đăng nhập thành công");
    } catch (error) {
      console.error("Full login error:", JSON.stringify(error, null, 2));
      console.error("Is Axios error:", axios.isAxiosError(error));
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error message:", error.message);

      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            toast.error(
              data.message || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại!"
            );
            break;
          case 401:
            toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
            break;
          case 403:
            toast.error(
              "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ!"
            );
            break;
          case 404:
            toast.error("Tài khoản không tồn tại!");
            break;
          case 429:
            toast.error("Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau!");
            break;
          case 500:
            toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.status === "ERROR"
      ) {
        const errorData = error.response.data.data;
        if (
          typeof errorData === "string" &&
          errorData.includes("400 Bad Request")
        ) {
          toast.error("Dữ liệu không hợp lệ, vui lòng kiểm tra lại!");
        } else if (
          typeof errorData === "string" &&
          errorData.includes("401 Unauthorized")
        ) {
          toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
        } else if (typeof errorData === "string" && errorData.includes("403")) {
          toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ!");
        } else if (typeof errorData === "string" && errorData.includes("404")) {
          toast.error("Tài khoản không tồn tại!");
        } else if (typeof errorData === "string" && errorData.includes("429")) {
          toast.error("Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau!");
        } else if (typeof errorData === "string" && errorData.includes("500")) {
          toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
        } else {
          toast.error("Lỗi không xác định từ máy chủ, vui lòng thử lại!");
        }
      } else {
        toast.error("Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng!");
      }
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const response = await loginWithGoogle();
      window.open(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div data-aos="fade-right" className={`login `}>
      <h1>Đăng nhập</h1>
      <div className="login-form">
        <Formik
          initialValues={initiateValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, errors, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="login-form_item">
                <label className="login-form_title" htmlFor="usernameOrEmail">
                  Tên đăng nhập hoặc Email
                </label>
                <Field
                  className="login-form_input"
                  type="text"
                  name="usernameOrEmail"
                />
                <ErrorMessage
                  name="usernameOrEmail"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="login-form_item password">
                <label className="login-form_title" htmlFor="password">
                  Mật khẩu
                </label>
                <Field
                  className="login-form_input"
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
              <button type="submit">Đăng nhập</button>
              <p>
                Bạn chưa có tài khoản?{" "}
                <span onClick={() => setIsLogin(false)}>Đăng ký</span>
              </p>
              <p
                className="p_forgotPassword"
                onClick={() => setIsForgotPassword(true)}
              >
                Quên mật khẩu?
              </p>
              {isFogotPassword && (
                <ForgotPassword setIsForgotPassword={setIsForgotPassword} />
              )}
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

export default LoginForm;
