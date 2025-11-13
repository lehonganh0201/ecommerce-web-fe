import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const stompClientRef = useRef(null);
  const TOKEN = localStorage.getItem("accessToken");
  const navigate = useNavigate(); // hook navigate

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(import.meta.env.VITE_API_URL.replace("/api/v1", "") + "/ws"),
      connectHeaders: { Authorization: `Bearer ${TOKEN}` },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = (frame) => {
      console.log("STOMP connected!", frame.headers);
      stompClientRef.current = client;

      client.subscribe("/topic/message", (msg) => {
        try {
          const response = JSON.parse(msg.body);
          let botContent = response.content || "Không có nội dung";

          if (response.products && response.products.length > 0) {
            botContent += `<div class="product-grid">
              ${renderProducts(response.products)}
            </div>`;
          }

          setMessages((prev) => [...prev, { content: botContent, type: "bot" }]);
          scrollToBottom();
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      });

      setMessages((prev) => [
        ...prev,
        { content: "Kết nối thành công! Bắt đầu chat.", type: "system" },
      ]);
      scrollToBottom();
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      setMessages((prev) => [
        ...prev,
        { content: "Lỗi kết nối STOMP", type: "system" },
      ]);
    };

    client.activate();
    return () => client.deactivate();
  }, [TOKEN]);

  // render products, thêm navigate vào onClick
  const renderProducts = (products) => {
    return products
      .map(
        (product) => `
      <div class="product-card">
        <img src="${
          product.images && product.images.length > 0
            ? product.images[0].image
            : "/images/default.jpg"
        }" alt="${product.name}" onerror="this.src='/images/default.jpg'"/>
        <h4>${product.name}</h4>
        <p class="category">Danh mục: ${product.categoryName || "N/A"}</p>
        <p class="price">${
          product.price
            ? new Intl.NumberFormat("vi-VN").format(product.price) + " VNĐ"
            : "N/A"
        }</p>
        <p class="stock">Tồn kho: ${product.stock || 0}</p>
        <p>${product.description?.substring(0, 50) + "..." || ""}</p>
        <button class="product-btn" data-id="${product.id}">Xem chi tiết</button>
      </div>`
      )
      .join("");
  };

  // xử lý click navigate cho button product
  useEffect(() => {
    const handleClick = (e) => {
      const btn = e.target.closest(".product-btn");
      if (btn) {
        const productId = btn.getAttribute("data-id");
        navigate(`/product/${productId}`);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [navigate]);

  const sendMessage = () => {
    const content = inputRef.current.value.trim();
    if (!content) return;

    const client = stompClientRef.current;
    if (client && client.connected) {
      client.publish({
        destination: "/app/message",
        body: JSON.stringify({ content }),
      });

      setMessages((prev) => [...prev, { content, type: "user" }]);
      inputRef.current.value = "";
      scrollToBottom();
    } else {
      alert("Chưa kết nối hoặc tin rỗng!");
    }
  };

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-50 hover:bg-blue-700 transition-all"
      >
        <IoChatbubbleEllipsesOutline size={28} />
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-2xl rounded-2xl z-50 border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold text-gray-700">Chatbot</h3>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto flex flex-col">
            <div ref={messagesEndRef}></div>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.type === "user"
                    ? "user text-right text-blue-600"
                    : msg.type === "bot"
                    ? "bot text-left text-green-600"
                    : "system text-center text-gray-500"
                }
                dangerouslySetInnerHTML={{ __html: msg.content }}
              ></div>
            ))}
          </div>

          <div className="border-t p-2 flex">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              ref={inputRef}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
              onClick={sendMessage}
            >
              Gửi
            </button>
          </div>
        </div>
      )}

      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 10px;
          padding: 10px;
          border: 1px solid #eee;
          border-radius: 5px;
          background: #f9f9f9;
        }
        .product-card {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          background: white;
        }
        .product-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 3px;
        }
        .product-card h4 { margin: 5px 0; font-size: 14px; }
        .product-card p { margin: 2px 0; font-size: 12px; color: #666; }
        .product-card .price { font-weight: bold; color: red; }
        .product-card button {
          background: #007bff;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          margin-top: 5px;
        }
        .product-card button:hover { background: #0056b3; }
      `}</style>
    </div>
  );
};

export default ChatWidget;
