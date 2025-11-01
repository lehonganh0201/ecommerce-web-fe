import Aos from "aos";
import React, { useEffect } from "react";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useRoutes } from "react-router-dom";
import Home from "@/pages/Home";
import Auth from "./pages/auth/Auth";
import VerifyOTP from "./components/auth/verifyOTP/VerifyOTP";

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
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/verifyOTP",
      element: <VerifyOTP />,
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
