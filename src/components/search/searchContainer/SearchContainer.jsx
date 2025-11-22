/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Pagination } from "antd";
import ProductItem from "@/components/product/discountedProduct/productItem/ProductItem";
import "./SearchContainer.scss";

const SearchContainer = ({ searchKeyword, inputImage }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [displayProducts, setDisplayProducts] = useState([]);

  const products = useSelector((state) => state.search.result);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setDisplayProducts(products?.slice(start, end));
  }, [page, products]);

  const total = products?.length || 0;

  return (
    <div data-aos="fade-up" className="search-container">
      {inputImage && (
        <div className="search-container__image">
          <img src={inputImage} alt="Sản phẩm tương tự" />
        </div>
      )}
      <p className="search-total">Có {total} kết quả tìm kiếm</p>
      <div className="search-container__list">
        {displayProducts?.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
      {total > pageSize && (
        <Pagination
          align="center"
          defaultCurrent={1}
          total={total}
          pageSize={pageSize}
          onChange={(page) => setPage(page)}
        />
      )}
    </div>
  );
}

export default SearchContainer;