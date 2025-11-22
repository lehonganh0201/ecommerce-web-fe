/* eslint-disable */
import React, { useEffect, useState } from "react";
import { fakeProducts } from "@/utils/const/Constant";

import "./ProductsContainer.scss";
import ProductItem from "../../discountedProduct/productItem/ProductItem";
import { Pagination } from "antd";
import { getProducts } from "@/apis/product";
import { useParams } from "react-router-dom";

const ProductsContainer = ({ price }) => {
  const { id } = useParams();
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const [sortedBy, setSortedBy] = useState("createdAt"); 
  const [sortDirection, setSortDirection] = useState("desc"); 

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "A - Z":
        setSortedBy("name");
        setSortDirection("asc");
        break;
      case "Z - A":
        setSortedBy("name");
        setSortDirection("desc");
        break;
      case "Giá tăng dần":
        setSortedBy("basePrice");
        setSortDirection("asc");
        break;
      case "Giá giảm dần":
        setSortedBy("basePrice");
        setSortDirection("desc");
        break;
      case "Hàng mới nhất":
        setSortedBy("createdAt");
        setSortDirection("desc");
        break;
      case "Hàng cũ nhất":
        setSortedBy("createdAt");
        setSortDirection("asc");
        break;
      default:
        setSortedBy("createdAt");
        setSortDirection("desc");
    }
  };

  useEffect(() => {
    const fetchProductByCategory = async () => {
      try {
        const minPriceValue = (price?.minPrice ?? 0) !== 0 ? price.minPrice : "";
        const maxPriceValue = (price?.maxPrice ?? 0) !== 0 ? price.maxPrice : "";

        const data = {
          sortedBy,
          sortDirection,
          page: currentPage - 1,
          size: pageSize,
          categoryId: id,
          status: true,
          minPrice: minPriceValue,
          maxPrice: maxPriceValue,
        };

        console.log("Data passed to API:", data); 
        console.log("Type minPrice:", typeof minPriceValue, minPriceValue); 

        const response = await getProducts(data);
        setProducts(response.data?.content || response.data || []);
        setTotalProducts(response.data?.totalElements || 0);
      } catch (error) {
        console.log("Fetch error:", error);
        setProducts([]);
      }
    };
    fetchProductByCategory();
  }, [pageSize, currentPage, price, sortedBy, sortDirection, id]);

  return (
    <div className="productsContainer">
      <div className="productsContainer__header">
        <h1>Tất cả sản phẩm</h1>
        <div className="productsContainer__header-search">
          <p>Sắp xếp theo</p>
          <select onChange={handleSortChange}>
            <option value="Mặc định">Mặc định</option>
            <option value="A - Z">A - Z</option>
            <option value="Z - A">Z - A</option>
            <option value="Giá tăng dần">Giá tăng dần</option>
            <option value="Giá giảm dần">Giá giảm dần</option>
            <option value="Hàng mới nhất">Hàng mới nhất</option>
            <option value="Hàng cũ nhất">Hàng cũ nhất</option>
          </select>
        </div>
      </div>
      <div className="productsContainer__list">
        {products?.length === 0 ? (
          <p>Không có sản phẩm nào phù hợp.</p>
        ) : (
          products.map((product, index) => (
            <ProductItem key={product.id || index} product={product} />
          ))
        )}
      </div>
      <Pagination
        align="center"
        pageSize={pageSize}
        total={totalProducts}
        current={currentPage}
        onChange={handleChangePage}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
};

export default ProductsContainer;