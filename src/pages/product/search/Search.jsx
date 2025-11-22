/* eslint-disable */
import Layout from '@/components/commons/layout/Layout';
import TitleRouter from '@/components/product/titleRouter/TitleRouter';
import SearchContainer from '@/components/search/searchContainer/SearchContainer';
import React, { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchByKeyword } from "@/store/searchSlice";

const Search = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const image = useSelector((state) => state.search.inputImage);
  const keyword = searchParams.get("searchKeyword");

  useEffect(() => {
    if (keyword) {
      dispatch(searchByKeyword(keyword));
    }
  }, [keyword, dispatch]);

  const getTitle = () => {
    if (keyword) return `Tìm kiếm: "${decodeURIComponent(keyword)}"`;
    if (image) return "Sản phẩm tương tự";
    return "Tìm kiếm";
  };

  return (
    <div>
      <Layout>
        <TitleRouter title={getTitle()} />
        <SearchContainer 
          searchKeyword={keyword}
          inputImage={image}
        />
      </Layout>
    </div>
  );
}

export default Search;