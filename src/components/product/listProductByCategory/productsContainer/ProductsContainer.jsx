/* eslint-disable*/
import React, { useEffect, useState } from "react";
import { fakeProducts } from "@/utils/const/Constant";

import "./ProductsContainer.scss";
import ProductItem from "../../discountedProduct/productItem/ProductItem";
import { Pagination } from "antd";
import { getProducts } from "@/apis/product";

const ProductsContainer = ({ price }) => {
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [products, setProducts] = useState([]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchProductByCategory = async () => {
      try {
        const data = {
          sortedBy: "createdAt",
          sortDirection: "desc",
          page: currentPage - 1,
          size: pageSize,
          category: price.categoryId,
          status: "true",
          minPrice: price.minPrice !== 0 ? price.minPrice : "",
          maxPrice: price.maxPrice !== 0 ? price.maxPrice : "",
        };

        const response = await getProducts(data);
        setProducts(response.data);
        setTotalProducts(response.data.totalElements);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductByCategory();
  }, [pageSize, currentPage, price]);

  return (
    <div className="productsContainer">
      <div className="productsContainer__header">
        <h1>Tất cả sản phẩm</h1>
        <div className="productsContainer__header-search">
          <p>Sắp xếp theo</p>
          <select>
            <option>Mặc định</option>
            <option>A - Z</option>
            <option>Z - A</option>
            <option>Giá tăng dần</option>
            <option>Giá giảm dần</option>
            <option>Hàng mới nhất</option>
            <option>Hàng cũ nhất</option>
          </select>
        </div>
      </div>
      <div className="productsContainer__list">
        {products?.map((product, index) => (
          <ProductItem key={product.id || index} product={product} />
        ))}
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
