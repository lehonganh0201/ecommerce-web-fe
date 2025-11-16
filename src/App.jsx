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
import ProductAdminPage from "./pages/admin/ProductAdminPage";
import ContactPage from "./pages/contact/ContactPage";
import BlogList from "./components/blog/BlogList";
import BlogDetail from "./components/blog/BlogDetail";
import MarketSystemPage from "./pages/market-system/MarketSystemPage";
import SearchResultPage from "./pages/blog/SearchResultPage";
import DetailProduct from "./pages/product/DetailProduct/DetailProduct";
import ProductsByCategory from "./pages/productsByCategory/ProductsByCategory";
import Cart from "./pages/cart/Cart";
import FollowingProducts from "./pages/followingProducts/FollowingProducts";
import Profile from "./pages/profile/Profile";
import References from "./pages/references/References";
import Search from "./pages/product/search/Search";
import Order from "./pages/order/Order";
import ProtectedRoute from "./components/auth/protectedRoute/ProtectedRoute";
import ChatWidget from "./components/chat/chatWidget/ChatWidget";
import OrderAdminPage from "./pages/admin/OrderAdminPage";

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
      path: "/product/:id",
      element: <DetailProduct />,
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/productsByCategory/:id",
      element: <ProductsByCategory />,
    },
    {
      path: "/followingProducts",
      element: <FollowingProducts />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/order",
      element: (
        <ProtectedRoute>
          <Order />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/references",
      element: <References />,
    },
    {
      path: "/blog",
      element: <BlogList />,
    },
    {
      path: "/blog/:slug",
      element: <BlogDetail />,
    },
    {
      path: "/search-blog",
      element: <SearchResultPage />,
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },
    {
      path: "/market-system",
      element: <MarketSystemPage />,
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
      path: "/admin/products",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <ProductAdminPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/categories",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <CategoryAdminPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/orders",
      element: (
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <OrderAdminPage />
        </ProtectedRoute>
      ),
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
      <ChatWidget />
    </>
  );
}

export default App;
