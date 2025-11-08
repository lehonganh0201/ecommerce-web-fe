import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import LayoutAdmin from "./LayoutAdmin";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { motion } from "framer-motion";
import ProductFilters from "@/components/admin/productAdmin/ProductFilters";
import ProductList from "@/components/admin/productAdmin/ProductList";
import ProductViewModal from "@/components/admin/productAdmin/ProductViewModal";
import ProductFormModal from "@/components/admin/productAdmin/ProductFormModal";
import { exportProductsToExcel } from "@/components/admin/productAdmin/productExcel";
import DeleteProductModal from "@/components/admin/productAdmin/DeleteProductModal";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  updateStatusProduct,
} from "@/apis/product";
const ProductAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(true);
  const [apiPage, setApiPage] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [statusFilter, setStatusFilter] = useState(true);
  const [token, setToken] = useState(
    localStorage.getItem("accessToken")
      ? localStorage.getItem("accessToken")
      : null
  );

  const getAllProducts = async (page = 0, size = itemsPerPage, search = "") => {
    try {
      const data = { page, size, keyword: search };
      const res = await getProducts(data);
      setProducts(res.data);
      setAllProducts(res.data);
      setHasNext(res.meta.hasNext);
      setHasPrevious(res.meta.hasPrevious);
      setTotalItems(res.meta.totalElements);
      setTotalPages(res.meta.totalPages);
      setApiPage(res.meta.page);
      setCurrentPage(apiPage + 1);
      setItemsPerPage(res.meta.size);
      setIsActive(res.meta.isActive);
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response.statusText} `
      );
      console.log(err);
    }
  };

  const filteredProducts = products?.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "All" || product.status === statusFilter)
  );

  useEffect(() => {
    getAllProducts(apiPage, itemsPerPage, searchQuery);
  }, [apiPage, itemsPerPage, searchQuery, statusFilter]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e);
  };

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setApiPage(0);
    setCurrentPage(1);
    getAllProducts(0, size, searchQuery);
  };
  const handlePageChange = (page) => {
    setApiPage(page - 1);
    setCurrentPage(page);
    getAllProducts(page - 1, itemsPerPage, searchQuery);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setApiPage(0);
    setCurrentPage(1);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal("view");
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal("add");
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal("edit");
  };

  const handleDeleteProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal("delete");
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await deleteProduct(id);
      if (response.status === 204) {
        toast.success("Xóa sản phẩm thành công");
        setShowModal(null);
        getAllProducts(apiPage, itemsPerPage, searchQuery);
      }
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response.statusText} `
      );
      console.log(err);
    }
  };

  const handleExportExcel = () => {
    exportProductsToExcel(filteredProducts);
  };

  const handleToggleActive = async (product) => {
    try {
      console.log("data change status:", {
        id: product.id,
        status: !product.isActive,
      });
      const res = await updateStatusProduct(product.id, !product.isActive);
      toast.success("Thay đổi trạng thái thành công!");
      getAllProducts(apiPage, itemsPerPage, searchQuery);
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} \n Nguyên nhân: ${err.response.statusText} `
      );
    }
  };
  const handleFormSubmit = async (formData, imageFiles) => {
    const formdata = new FormData();
    formdata.append("name", formData.name);
    formdata.append("description", formData.description);
    formdata.append("basePrice", formData.price);
    formdata.append("categoryId", formData.categoryId);

    if (
      showModal === "edit" &&
      formData.imageIdsToDelete &&
      formData.imageIdsToDelete.length > 0
    ) {
      formData.imageIdsToDelete.forEach((id) => {
        formdata.append("imageIdsToDelete", id);
      });
    }

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formdata.append("images", file);
      });
    }

    for (let pair of formdata.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      if (showModal === "add") {
        const response = await createProduct(formdata);
        if (response.status === 201) {
          toast.success("Thêm sản phẩm thành công");
        }
      } else if (showModal === "edit") {
        const response = await updateProduct(formData.id, formdata);
        if (response.status === 200) {
          toast.success("Cập nhật sản phẩm thành công");
        }
      }
      setShowModal(null);
      getAllProducts(apiPage, itemsPerPage, searchQuery);
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} \n Nguyên nhân: ${err.response?.statusText || ""}`
      );
      console.log(err);
    }
  };

  return (
    <LayoutAdmin>
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAdmin title={"Quản lý sản phẩm"} />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 10, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              onExportExcel={handleExportExcel}
              onAddProduct={handleAddProduct}
            />

            <ProductList
              products={products}
              apiPage={apiPage}
              currentPage={currentPage}
              productsPerPage={itemsPerPage}
              totalProducts={totalItems}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onProductsPerPageChange={handleItemsPerPageChange}
              onViewProduct={handleViewProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProductClick}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onSort={handleSort}
              sortConfig={sortConfig}
              onToggleActive={handleToggleActive}
            />
            {showModal === "view" && selectedProduct && (
              <ProductViewModal
                product={selectedProduct}
                onClose={() => setShowModal(null)}
                onEdit={handleEditProduct}
                token={token}
              />
            )}

            {(showModal === "add" || showModal === "edit") && (
              <ProductFormModal
                isOpen={true}
                onClose={() => setShowModal(null)}
                onSubmit={handleFormSubmit}
                initialData={
                  showModal === "edit"
                    ? {
                        id: selectedProduct.id,
                      }
                    : null
                }
                formType={showModal}
              />
            )}

            {showModal === "delete" && selectedProduct && (
              <DeleteProductModal
                isOpen={true}
                onClose={() => setShowModal(null)}
                onConfirm={handleDeleteProduct}
                product={selectedProduct}
              />
            )}
          </motion.div>
        </main>
      </div>
    </LayoutAdmin>
  );
};

export default ProductAdminPage;
