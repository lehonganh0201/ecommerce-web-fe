/* eslint-disable */
import Layout from "@/components/commons/layout/Layout";
import CategoryHeader from "@/components/product/listProductByCategory/categoryHeader/CategoryHeader";
import MenuSidebar from "@/components/product/listProductByCategory/menuSidebar/MenuSidebar";
import ProductsContainer from "@/components/product/listProductByCategory/productsContainer/ProductsContainer";
import TitleRouter from "@/components/product/titleRouter/TitleRouter";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById } from "@/apis/category";
import "./ProductsByCategory.scss";

const ProductsByCategory = () => {
  const { id } = useParams();
  const [price, setPrice] = useState({
    minPrice: 0,
    maxPrice: 0,
  });
  const [categoryName, setCategoryName] = useState(""); 
  useEffect(() => {
    setPrice({
      minPrice: 0,
      maxPrice: 0,
    });

    const fetchCategoryName = async () => {
      try {
        const res = await getCategoryById(id);
        setCategoryName(res.data.name);
      } catch (error) {
        console.log("Lỗi khi lấy tên danh mục:", error);
        setCategoryName("Không xác định");
      }
    };

    fetchCategoryName();
  }, [id]);

  return (
    <Layout>
      <div className="productsByCategory">
        <TitleRouter title={categoryName || "Đang tải..."} />
        <CategoryHeader />
        <div className="productsByCategory__container">
          <ProductsContainer price={price} />
          <MenuSidebar setPrice={setPrice} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductsByCategory;
