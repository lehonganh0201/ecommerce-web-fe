// src/components/admin/userAdmin/userExcel.js
import * as XLSX from "xlsx";

export const exportUsersToExcel = (users) => {
  if (!users || users.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const worksheetData = users.map((user) => ({
    ID: user.id,
    "Tên đăng nhập": user.username,
    Email: user.email,
    "Số điện thoại": user.phoneNumber,
    "Họ": user.firstName,
    "Tên": user.lastName,
    "Ngày sinh": user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") : "",
    "Giới tính": user.isMale ? "Nam" : "Nữ",
    "Vai trò": user.roleName,
    "Kích_hoạt": user.enabled ? "Có" : "Không",
    "Khóa": user.locked ? "Có" : "Không",
    "Số dư": `${user.balance?.toLocaleString("vi-VN")} VNĐ`,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách người dùng");

  // Auto-fit columns
  const colWidths = worksheetData[0] ? Object.keys(worksheetData[0]).map(() => ({ wch: 15 })) : [];
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, "danh-sach-nguoi-dung.xlsx");
};