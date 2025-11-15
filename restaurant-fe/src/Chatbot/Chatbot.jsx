import React, { useState } from 'react';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa'; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chào bạn! Tôi có thể giúp gì?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const userMessage = { sender: 'user', text: newMessage };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // 1. ĐỊA CHỈ API CỦA BẠN (BACKEND)
      const API_URL = `${import.meta.env.VITE_API_URL}/api/chatbot`;

      // 2. TẠO REQUEST BODY
      // TÔI GIẢ SỬ class ChatBotRequest của bạn có dạng { "message": "..." }
      // HÃY SỬA LẠI NẾU TÊN TRƯỜNG KHÁC (ví dụ: "prompt", "text"...)
      const requestBody = {
        question: newMessage 
      };

      // 3. GỌI API BẰNG FETCH (Phương thức POST)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // 4. NHẬN KẾT QUẢ DẠNG TEXT (Vì backend trả về String)
      const botText = await response.text();
      const botMessage = { sender: 'bot', text: botText };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Lỗi khi gọi API chatbot:', error);
      const errorMessage = { sender: 'bot', text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-[#174C34] text-white p-3 flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold">Chat với Bot</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-yellow-300">
              <FaTimes />
            </button>
          </div>

          {/* Khung chat */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-3 py-2 rounded-lg ${
                  msg.sender === 'user' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {msg.text}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <span className="inline-block px-3 py-2 rounded-lg bg-gray-200 text-gray-800">
                  ...
                </span>
              </div>
            )}
          </div>

          {/* Ô nhập liệu */}
          <div className="p-3 border-t flex">
            <input
              type="text"
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-[#174C34] text-white px-4 rounded-r-lg hover:bg-opacity-90"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      {/* Nút bong bóng chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#174C34] text-white cursor-pointer w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl z-50 hover:bg-opacity-90 transition-transform hover:scale-110"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>
    </>
  );
};

export default Chatbot;