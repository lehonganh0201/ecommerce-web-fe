import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const stompClientRef = useRef(null);
  const TOKEN = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // FIX: useEffect để scroll sau khi messages hoặc isTyping thay đổi (sau re-render)
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!TOKEN) {
      console.log("User not logged in. Socket connection not established.");
      return;
    }

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
            botContent += `<div class="product-grid mt-4">
              ${renderProducts(response.products)}
            </div>`;
          }

          setMessages((prev) => [...prev, { content: botContent, type: "bot" }]);
          setIsTyping(false);
          // XÓA: scrollToBottom() ở đây – để useEffect handle
        } catch (error) {
          console.error("Error parsing message:", error);
          setIsTyping(false);
        }
      });

      // XÓA: setMessages empty và scrollToBottom() – không cần nếu messages rỗng ban đầu
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      setMessages((prev) => [
        ...prev,
        { content: "Lỗi kết nối STOMP", type: "system" },
      ]);
      setIsTyping(false);
    };

    client.activate();

    return () => client.deactivate();
  }, [TOKEN]);

  const renderProducts = (products) => {
    return products
      .map(
        (product) => `
      <div class="product-card bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
        <img src="${
          product.images && product.images.length > 0
            ? product.images[0].image
            : "/images/default.jpg"
        }" alt="${product.name}" class="w-full h-24 object-cover rounded-lg mb-2" onerror="this.src='/images/default.jpg'"/>
        <h4 class="font-semibold text-sm text-gray-800 mb-1">${product.name}</h4>
        <p class="price text-sm font-bold text-blue-600 mb-1">${
          product.basePrice
            ? new Intl.NumberFormat("vi-VN").format(product.basePrice) + " VNĐ"
            : "N/A"
        }</p>
        <p class="stock text-xs text-gray-500 mb-2">Tồn kho: ${product.stock || 0}</p>
        <p class="description text-xs text-gray-700 mb-3">${product.description?.substring(0, 60) + "..." || ""}</p>
        <button class="product-btn w-full bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors duration-200 cursor-pointer" data-id="${product.id}">Xem chi tiết</button>
      </div>`
      )
      .join("");
  };

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
      setIsTyping(true);
      // XÓA: scrollToBottom() ở đây – để useEffect handle
    } else {
      alert("Chưa kết nối hoặc tin rỗng!");
    }
  };

  const MessageBubble = ({ type, content }) => (
    <div
      className={`mb-3 max-w-xs ${
        type === "user"
          ? "ml-auto bg-blue-500 text-white rounded-2xl p-3 shadow-lg"
          : type === "bot"
          ? "mr-auto bg-gray-100 text-gray-800 rounded-2xl p-3 shadow-sm"
          : "mx-auto bg-yellow-100 text-yellow-800 rounded-xl p-2 shadow-sm"
      }`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );

  const TypingIndicator = () => (
    <MessageBubble
      type="bot"
      content={`
        <div class="flex items-center space-x-1">
          <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]"></span>
          <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
          <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        </div>
      `}
    />
  );

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-xl cursor-pointer z-50 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <IoChatbubbleEllipsesOutline size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white shadow-2xl rounded-3xl z-50 border border-gray-200/50 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 flex items-center">
              <IoChatbubbleEllipsesOutline className="mr-2 text-blue-500" size={20} />
              Chatbot Assistant
            </h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div ref={messagesEndRef} className="pb-2"></div>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} type={msg.type} content={msg.content} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>

          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn của bạn..."
                className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all"
                ref={inputRef}
                autoFocus  // THÊM: Auto focus input để ổn định sau send
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();  // THÊM: Ngăn submit mặc định nếu wrap form
                    sendMessage();
                  }
                }}
              />
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={sendMessage}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;