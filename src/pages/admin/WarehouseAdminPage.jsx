// src/pages/admin/WarehouseAdminPage.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LayoutAdmin from "./LayoutAdmin";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { motion } from "framer-motion";
import WarehouseFilters from "@/components/admin/warehouseAdmin/WarehouseFilters";
import WarehouseList from "@/components/admin/warehouseAdmin/WarehouseList";
import WarehouseViewModal from "@/components/admin/warehouseAdmin/WarehouseViewModal";
import WarehouseFormModal from "@/components/admin/warehouseAdmin/WarehouseFormModal";
import DeleteWarehouseModal from "@/components/admin/warehouseAdmin/DeleteWarehouseModal";
import OrdersInWarehouseModal from "@/components/admin/warehouseAdmin/OrdersInWarehouseModal";
import { exportWarehousesToExcel } from "@/components/admin/warehouseAdmin/warehouseExcel";
import {
  getAllWarehouses,
  getWarehouseById,
  getOrdersInWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/apis/warehouse";

const WarehouseAdminPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(true);
  const [apiPage, setApiPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [availableFilter, setAvailableFilter] = useState(true); // Default to available=true
  const [cityFilter, setCityFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [wardFilter, setWardFilter] = useState("");

  const getAllWarehousesData = async (
    page = 0,
    size = itemsPerPage,
    city = "",
    district = "",
    ward = "",
    available = true,
    sortBy = null,
    sortDir = null
  ) => {
    try {
      const params = {
        page,
        size,
        sort: sortBy || "name",
        direction: sortDir || "ASC",
        ...(city && { city }),
        ...(district && { district }),
        ...(ward && { ward }),
        available,
      };
      const res = await getAllWarehouses(params);
      setWarehouses(res.data);
      setAllWarehouses(res.data);
      setHasNext(res.meta.hasNext);
      setHasPrevious(res.meta.hasPrevious);
      setTotalItems(res.meta.totalElements);
      setTotalPages(res.meta.totalPages);
      setApiPage(res.meta.currentPage || res.meta.number || 0);
      setCurrentPage((res.meta.currentPage || res.meta.number || 0) + 1);
      setItemsPerPage(res.meta.pageSize || res.meta.size);
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || "Unknown"}`
      );
      console.log(err);
    }
  };

  const filteredWarehouses = warehouses?.filter(
    (warehouse) =>
      warehouse.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.fullAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.id?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    const sortBy = sortConfig.key || "name";
    const sortDir = sortConfig.direction || "ASC";
    getAllWarehousesData(
      apiPage,
      itemsPerPage,
      cityFilter,
      districtFilter,
      wardFilter,
      availableFilter,
      sortBy,
      sortDir
    );
  }, [apiPage, itemsPerPage, cityFilter, districtFilter, wardFilter, availableFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setApiPage(0);
    setCurrentPage(1);
    const sortBy = sortConfig.key || "name";
    const sortDir = sortConfig.direction || "ASC";
    getAllWarehousesData(
      0,
      size,
      cityFilter,
      districtFilter,
      wardFilter,
      availableFilter,
      sortBy,
      sortDir
    );
  };

  const handlePageChange = (page) => {
    setApiPage(page - 1);
    setCurrentPage(page);
    const sortBy = sortConfig.key || "name";
    const sortDir = sortConfig.direction || "ASC";
    getAllWarehousesData(
      page - 1,
      itemsPerPage,
      cityFilter,
      districtFilter,
      wardFilter,
      availableFilter,
      sortBy,
      sortDir
    );
  };

  const handleAvailableFilterChange = (available) => {
    setAvailableFilter(available);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleCityFilterChange = (city) => {
    setCityFilter(city);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleDistrictFilterChange = (district) => {
    setDistrictFilter(district);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleWardFilterChange = (ward) => {
    setWardFilter(ward);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleViewWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowModal("view");
  };

  const handleAddWarehouse = () => {
    setSelectedWarehouse(null);
    setShowModal("add");
  };

  const handleEditWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowModal("edit");
  };

  const handleDeleteWarehouseClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowModal("delete");
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    try {
      await deleteWarehouse(warehouseId);
      toast.success("Xóa kho thành công");
      setShowModal(null);
      const sortBy = sortConfig.key || "name";
      const sortDir = sortConfig.direction || "ASC";
      getAllWarehousesData(
        apiPage,
        itemsPerPage,
        cityFilter,
        districtFilter,
        wardFilter,
        availableFilter,
        sortBy,
        sortDir
      );
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || ""}`
      );
      console.log(err);
    }
  };

  const handleExportExcel = () => {
    exportWarehousesToExcel(warehouses);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (showModal === "add") {
        await createWarehouse(formData);
        toast.success("Thêm kho thành công");
      } else if (showModal === "edit") {
        await updateWarehouse(selectedWarehouse.id, formData);
        toast.success("Cập nhật kho thành công");
      }
      setShowModal(null);
      const sortBy = sortConfig.key || "name";
      const sortDir = sortConfig.direction || "ASC";
      getAllWarehousesData(
        apiPage,
        itemsPerPage,
        cityFilter,
        districtFilter,
        wardFilter,
        availableFilter,
        sortBy,
        sortDir
      );
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} \n Nguyên nhân: ${err.response?.statusText || ""}`
      );
      console.log(err);
    }
  };

  const handleViewOrders = async (warehouseId) => {
    setSelectedWarehouse({ id: warehouseId });
    setShowModal("orders");
  };

  const availableCounts = {
    all: allWarehouses.length,
    available: allWarehouses.filter(w => w.available === true).length,
    unavailable: allWarehouses.filter(w => w.available === false).length,
  };

  return (
    <LayoutAdmin>
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAdmin title={"Quản lý kho chứa"} />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WarehouseFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              availableFilter={availableFilter}
              onAvailableFilterChange={handleAvailableFilterChange}
              cityFilter={cityFilter}
              onCityFilterChange={handleCityFilterChange}
              districtFilter={districtFilter}
              onDistrictFilterChange={handleDistrictFilterChange}
              wardFilter={wardFilter}
              onWardFilterChange={handleWardFilterChange}
              onExportExcel={handleExportExcel}
              onAddWarehouse={handleAddWarehouse}
              availableCounts={availableCounts}
              totalCount={allWarehouses.length}
            />

            <WarehouseList
              warehouses={filteredWarehouses.length > 0 ? filteredWarehouses : warehouses}
              apiPage={apiPage}
              currentPage={currentPage}
              warehousesPerPage={itemsPerPage}
              totalWarehouses={totalItems}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onWarehousesPerPageChange={handleItemsPerPageChange}
              onViewWarehouse={handleViewWarehouse}
              onEditWarehouse={handleEditWarehouse}
              onDeleteWarehouse={handleDeleteWarehouseClick}
              onViewOrders={handleViewOrders}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            {showModal === "view" && selectedWarehouse && (
              <WarehouseViewModal
                warehouse={selectedWarehouse}
                onClose={() => setShowModal(null)}
                onEdit={handleEditWarehouse}
                onViewOrders={handleViewOrders}
              />
            )}

            {(showModal === "add" || showModal === "edit") && (
              <WarehouseFormModal
                isOpen={true}
                onClose={() => setShowModal(null)}
                onSubmit={handleFormSubmit}
                initialData={showModal === "edit" ? selectedWarehouse : null}
                formType={showModal}
              />
            )}

            {showModal === "delete" && selectedWarehouse && (
              <DeleteWarehouseModal
                isOpen={true}
                onClose={() => setShowModal(null)}
                onConfirm={handleDeleteWarehouse}
                warehouse={selectedWarehouse}
              />
            )}

            {showModal === "orders" && selectedWarehouse && (
              <OrdersInWarehouseModal
                warehouseId={selectedWarehouse.id}
                onClose={() => setShowModal(null)}
              />
            )}
          </motion.div>
        </main>
      </div>
    </LayoutAdmin>
  );
};

export default WarehouseAdminPage;