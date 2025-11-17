// src/components/admin/warehouseAdmin/warehouseExcel.js
import * as XLSX from "xlsx";

export const exportWarehousesToExcel = (warehouses) => {
  if (!warehouses || warehouses.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const worksheetData = warehouses.map((warehouse) => ({
    ID: warehouse.id,
    "Tên kho": warehouse.name,
    "Số điện thoại": warehouse.phoneNumber,
    "Địa chỉ đầy đủ": warehouse.fullAddress,
    "Dung lượng tối đa": warehouse.maxCapacity,
    "Dung lượng hiện tại": warehouse.currentCapacity,
    Trạng_thái: warehouse.status,
    "Sẵn có": warehouse.isAvailable ? "Có" : "Không",
    Mô_tả: warehouse.description || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách kho");

  const colWidths = Object.keys(worksheetData[0]).map(() => ({ wch: 20 }));
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, "danh-sach-kho.xlsx");
};