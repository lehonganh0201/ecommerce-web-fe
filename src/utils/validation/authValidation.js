/* eslint-disable*/
import * as Yup from "yup";

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Họ không được để trống"),
  lastName: Yup.string().required("Tên không được để trống"),
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email không được để trống")
    .max(100, "Email không được quá 100 ký tự"),
  phoneNumber: Yup.string()
    .required("Số điện thoại không được để trống")
    .matches(
      /^(0[0-9]{9})$/,
      "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"
    ),
  isMale: Yup.boolean()
    .required("Giới tính không được để trống")
    .typeError("Vui lòng chọn giới tính"),
  dateOfBirth: Yup.date()
    .required("Ngày sinh không được để trống")
    .max(new Date(), "Ngày sinh không được lớn hơn ngày hiện tại"),
  userName: Yup.string()
    .required("Tên đăng nhập không được để trống")
    .min(5, "Tên đăng nhập phải có ít nhất 5 ký tự")
    .max(20, "Tên đăng nhập không được quá 20 ký tự"),
  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/,
      "Mật khẩu phải chứa ít nhất 1 chữ in hoa, 1 chữ in thường, 1 ký tự đặc biệt"
    ),
  confirmPassword: Yup.string()
    .required("Xác nhận mật khẩu không được để trống")
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp"),
});

export const loginValidationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .required("Tên đăng nhập hoặc email không được để trống")
    .test(
      "username-or-email",
      "Phải là tên đăng nhập hợp lệ (5–20 ký tự) hoặc email hợp lệ",
      (value) => {
        if (!value) return false;
        const usernameRegex = /^[a-zA-Z0-9._-]{5,20}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return usernameRegex.test(value) || emailRegex.test(value);
      }
    ),
  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/,
      "Mật khẩu phải chứa ít nhất 1 chữ in hoa, 1 chữ in thường, 1 ký tự đặc biệt"
    ),
});
