// src/components/admin/warehouseAdmin/WarehouseList.jsx
import React from "react";
import WarehouseListItem from "./WarehouseListItem";
import WarehousePagination from "./WarehousePagination";

const WarehouseList = ({
  warehouses,
  apiPage,
  currentPage,
  warehousesPerPage,
  totalWarehouses,
  totalPages,
  onPageChange,
  onWarehousesPerPageChange,
  onViewWarehouse,
  onEditWarehouse,
  onDeleteWarehouse,
  onViewOrders,
  hasNext,
  hasPrevious,
  onSort,
  sortConfig,
}) => {
  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = warehouses;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("id")}
              >
                ID {sortConfig.key === "id" && (sortConfig.direction === "ASC" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("name")}
              >
                Tên kho {sortConfig.key === "name" && (sortConfig.direction === "ASC" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("maxCapacity")}
              >
                Dung lượng tối đa {sortConfig.key === "maxCapacity" && (sortConfig.direction === "ASC" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sẵn có
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentWarehouses?.map((warehouse) => (
              <WarehouseListItem
                key={warehouse.id}
                warehouse={warehouse}
                onView={onViewWarehouse}
                onEdit={onEditWarehouse}
                onDelete={onDeleteWarehouse}
                onViewOrders={onViewOrders}
              />
            ))}
          </tbody>
        </table>
      </div>

      <WarehousePagination
        contentWarehouse={warehouses}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={warehousesPerPage}
        totalItems={totalWarehouses}
        onPageChange={onPageChange}
        onItemsPerPageChange={onWarehousesPerPageChange}
        indexOfFirstItemWarehouse={indexOfFirstWarehouse}
        indexOfLastItem={indexOfLastWarehouse}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        itemName="kho"
      />
    </div>
  );
};

export default WarehouseList;