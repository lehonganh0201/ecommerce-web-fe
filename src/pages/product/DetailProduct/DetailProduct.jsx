import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InformationDetail from "@/components/product/detailProduct/informationDetail/InformationDetail";
import Layout from "@/components/commons/layout/Layout";
import TitleRouter from "@/components/product/titleRouter/TitleRouter";
import LeftSession from "@/components/product/detailProduct/leftSession/LeftSession";
import RightSession from "@/components/product/detailProduct/rightSession/RightSession";
import { getProductById } from "@/apis/product";
import "./DetailProduct.scss";
import AddComment from "@/components/product/comment/addComments/AddComment";

const DetailProduct = () => {
  const productId = useParams().id;
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isShowAddComment, setIsShowAddComment] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          setIsLoading(true);
          const response = await getProductById(productId);

          setProduct(response.data);

          setIsLoading(false);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            switch (error.response.status) {
              case 500:
                toast.error("Lỗi hệ thống");
                break;
              case 404:
                toast.error("Sản phẩm không tồn tại");
                break;
              default:
                toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
            }
          }
        }
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <>
      {!isLoading ? (
        <>
          <Layout>
            <TitleRouter title={product.name} />
            <div data-aos="fade-up" className="detail-product_info">
              <LeftSession product={product} />
              <RightSession product={product} />
            </div>
            <InformationDetail
              product={product}
              setIsShowAddComment={setIsShowAddComment}
              isShowAddComment={isShowAddComment}
            />
          </Layout>
          {isShowAddComment && (
            <div className="fixed inset-0 z-10 flex justify-center items-center">
              <div
                className="absolute inset-0 bg-black opacity-30"
                onClick={() => setIsShowAddComment(false)}
              ></div>
              <div className="relative z-20">
                <AddComment
                  setIsShowAddComment={setIsShowAddComment}
                  productId={productId}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="loadingOverlay">
          <div className="spinner"></div>
        </div>
      )}
    </>
  );
};

export default DetailProduct;
