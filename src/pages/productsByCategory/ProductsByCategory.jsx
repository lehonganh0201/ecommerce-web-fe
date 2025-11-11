/* eslint-disable*/
import Layout from "@/components/commons/layout/Layout";
import CategoryHeader from "@/components/product/listProductByCategory/categoryHeader/CategoryHeader";
import MenuSidebar from "@/components/product/listProductByCategory/menuSidebar/MenuSidebar";
import ProductsContainer from "@/components/product/listProductByCategory/productsContainer/ProductsContainer";
import TitleRouter from "@/components/product/titleRouter/TitleRouter";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import "./ProductsByCategory.scss";
const ProductsByCategory = () => {
  const { id } = useParams();
  const [price, setPrice] = useState({
    categoryId: id,
    minPrice: 0,
    maxPrice: 0,
  });

  return (
    <Layout>
      <div className="productsByCategory">
        <TitleRouter title={id} />
        <CategoryHeader />
        <div className="productsByCategory__container">
          <ProductsContainer price={price} />
          <MenuSidebar setPrice={setPrice}  />
        </div>
      </div>
    </Layout>
  );
};

export default ProductsByCategory;
