import Aos from "aos";
import React, { useEffect } from "react";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useRoutes } from "react-router-dom";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import VerifyOTP from "./components/auth/verifyOTP/VerifyOTP";
import CategoryAdminPage from "./pages/admin/CategoryAdminPage";
import ContactPage from "./pages/contact/ContactPage";
import BlogList from "./components/blog/BlogList";
import BlogDetail from "./components/blog/BlogDetail";
import SearchResultPage from "./pages/blog/SearchResultPage";

function App() {
  useEffect(() => {
    Aos.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy một lần khi cuộn
    });
  }, []);
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/blog",
      element: <BlogList/>
    },
    {
      path: '/blog/:slug',
      element:<BlogDetail/>
    },
    {
      path: "/search-blog",
      element: <SearchResultPage/>
    },
    {
      path: "/contact",
      element: <ContactPage/>
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/verifyOTP",
      element: <VerifyOTP />,
    },
    {
      path: "/admin/categories",
      element: <CategoryAdminPage />,
    },
  ]);
  return (
    <>
      <ToastContainer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 980,
        }}
        limit={10}
      />
      {routes}
    </>
  );
}

export default App;
