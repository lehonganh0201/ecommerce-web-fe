import React, { useEffect, useState, useCallback } from "react";
import { motion as Motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  exportOrdersToExcel,
  getOrderStatusCounts,
} from "@/components/admin/orderAdmin/orderExcel";
import { getOrders } from "@/apis/order";
import OrderFilters from "@/components/admin/orderAdmin/OrderFilters";
import LayoutAdmin from "./LayoutAdmin";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import OrderList from "@/components/admin/orderAdmin/OrderList";
import OrderViewModal from "@/components/admin/orderAdmin/OrderViewModal";

const OrderAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiPage, setApiPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const statusCounts = getOrderStatusCounts(orders);

  const token = localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null;

  const getAllOrders = useCallback(
    async (page = 0, size = itemsPerPage) => {
      const data = {
        page,
        size,
        status: statusFilter === "All" ? null : statusFilter,
        sortedBy: sortBy,
        sortDirection,
      };
      try {
        const res = await getOrders(data);
        setOrders(res.data);
        setTotalItems(res.meta.totalElements);
        setTotalPage(res.meta.totalPages);
        setHasNext(res.meta.hasNext);
        setHasPrevious(res.meta.hasPrevious);
        setApiPage(res.meta.page);
        setCurrentPage(apiPage + 1);
        setItemsPerPage(res.meta.size);
      } catch (err) {
        toast.error(
          `Lỗi: ${err.message} \n Nguyên nhân: ${err.response?.statusText} `
        );
      }
    },
    [statusFilter, sortBy, sortDirection, apiPage, itemsPerPage]
  );

  useEffect(() => {
    getAllOrders(apiPage, itemsPerPage);
  }, [apiPage, itemsPerPage, searchQuery, getAllOrders]);

  const handleSort = (field) => {
    const nextDirection =
      sortBy === field ? (sortDirection === "asc" ? "desc" : "asc") : "asc";
    setSortBy(field);
    setSortDirection(nextDirection);
    // Reset to first page when sorting changes
    setApiPage(0);
    setCurrentPage(1);
    getAllOrders(0, itemsPerPage);
  };
  const handlePageChange = (page) => {
    setApiPage(page - 1);
    setCurrentPage(page);
    getAllOrders(page - 1, itemsPerPage);
  };
  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setApiPage(0);
    setCurrentPage(1);
    getAllOrders(0, size);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleExportExcel = () => {
    exportOrdersToExcel(orders);
  };

  return (
    <LayoutAdmin>
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAdmin title={"Quản lý đơn hàng"} />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 10, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OrderFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onExportExcel={handleExportExcel}
              statusCounts={statusCounts}
              totalCount={orders.length}
            />

            <OrderList
              orders={orders}
              currentPage={currentPage}
              ordersPerPage={itemsPerPage}
              totalOrders={totalItems}
              totalPages={totalPage}
              onPageChange={handlePageChange}
              onOrdersPerPageChange={handleItemsPerPageChange}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onViewOrder={handleViewOrder}
              onStatusChange={getAllOrders}
              onSort={handleSort}
            />
            {showModal && selectedOrder && (
              <OrderViewModal
                order={selectedOrder}
                onClose={() => setShowModal(false)}
                token={token}
              />
            )}
          </Motion.div>
        </main>
      </div>
    </LayoutAdmin>
  );
};

export default OrderAdminPage;
