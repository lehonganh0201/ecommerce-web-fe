import Aos from "aos";
import React, { useEffect } from "react";
import "aos/dist/aos.css";
import { useRoutes } from "react-router-dom";
import Home from "@/pages/Home";

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
  ]);
  return <>{routes}</>;
}

export default App;
